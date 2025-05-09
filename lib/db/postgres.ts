import { Pool, type PoolClient } from "pg"
import { config } from "../config"
// Create a connection pool with proper configuration for serverless environments
let pool: Pool | null = null

// Initialize the pool lazily to avoid issues during build time
function getPool(): Pool {
  if (!pool) {
    // Use connection string if available, otherwise build from individual params
    pool = new Pool({
      // If no connection string is provided, use individual parameters
      host: config.host?.toString(),
      port: Number(config.port),
      database: config.database,
      user: config.user,
      password: config.password,
      ssl: config.isAWS
        ? {
            rejectUnauthorized: false,
            ca: config.ssl,
            minVersion: "TLSv1.2",
            ciphers: "HIGH:!aNULL:!MD5",
          }
        : undefined,
      max: 10, // Reduce max connections for serverless environment
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    })

    // Log connection errors
    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err)
      // Don't exit process in serverless environment
      pool = null
    })
  }

  return pool
}

/**
 * Execute a query with parameters
 */
export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const start = Date.now()
  const client = await getPool().connect()
  try {
    // Enable statement timeout to prevent long-running queries
    await client.query("SET statement_timeout = 5000") // 5 seconds
    const result = await client.query(text, params)
    return result.rows as T[]
  } catch (error) {
    console.error("Query error:", error)
    throw error
  } finally {
    client.release()
  }
}

/**
 * Execute a query and return a single row
 */
export async function queryOne<T = any>(text: string, params: any[] = []): Promise<T | null> {
  try {
    const result = await query<T>(text, params)
    return result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("QueryOne error:", error)
    throw error
  }
}

/**
 * Execute a transaction with multiple queries
 */
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Transaction error:", error)
    throw error
  } finally {
    client.release()
  }
}

/**
 * Check if the database connection is working
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await query("SELECT 1")
    return true
  } catch (error) {
    console.error("Database connection error:", error)
    return false
  }
}

/**
 * Get a client from the pool
 */
export async function getClient(): Promise<PoolClient> {
  return await getPool().connect()
}

/**
 * Execute a query and return the count
 */
export async function queryCount(text: string, params: any[] = []): Promise<number> {
  const client = await getPool().connect()
  try {
    const result = await client.query(text, params)
    return Number.parseInt(result.rowCount?.toString() || "0")
  } finally {
    client.release()
  }
}

// Create a helper for environment variable
export const env = {
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  useLocalAuth: process.env.USE_LOCAL_AUTH === "true",
}
