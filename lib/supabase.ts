import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

let serverSupabaseClient: ReturnType<typeof createClient<Database>> | null = null
let clientSupabaseClient: ReturnType<typeof createClient<Database>> | null = null

// Check if Supabase environment variables are available
export function hasSupabaseCredentials(): boolean {
  if (typeof window === "undefined") {
    // Server-side check
    return !!(
      process.env.SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  } else {
    // Client-side check
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }
}

// Create a single supabase client for the entire server-side application
export const createServerSupabaseClient = () => {
  if (serverSupabaseClient) return serverSupabaseClient
  // This should only be called on the server

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables for server client")
    return null
  }

  try {
    serverSupabaseClient = createClient<Database>(supabaseUrl, supabaseKey)
    return serverSupabaseClient
  } catch (error) {
    console.error("Error creating server Supabase client:", error)
    return null
  }
}

// Create a singleton client for client-side usage

export const createClientSupabaseClient = () => {
  if (clientSupabaseClient) return clientSupabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables for client client")
    return null
  }

  try {
    clientSupabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    return clientSupabaseClient
  } catch (error) {
    console.error("Error creating client Supabase client:", error)
    return null
  }
}

// Safe version that falls back to null if environment variables are missing
export const createSafeServerSupabaseClient = () => {
  try {
    return createServerSupabaseClient()
  } catch (error) {
    console.warn("Could not create Supabase client:", error)
    return null
  }
}

export const createSafeClientSupabaseClient = () => {
  try {
    // Only create client Supabase client on the client side
    if (typeof window === "undefined") {
      console.warn("createSafeClientSupabaseClient was called on the server side. Using server client instead.")
      return createSafeServerSupabaseClient()
    }

    return createClientSupabaseClient()
  } catch (error) {
    console.warn("Could not create Supabase client:", error)
    return null
  }
}

// Universal safe client that works in both environments
export const createUniversalSupabaseClient = () => {
  if (typeof window === "undefined") {
    // Server-side
    const client = createSafeServerSupabaseClient()
    if (!client) {
      console.error("Failed to create server Supabase client")
    }
    return client
  } else {
    // Client-side
    const client = createSafeClientSupabaseClient()
    if (!client) {
      console.error("Failed to create client Supabase client")
    }
    return client
  }
}
