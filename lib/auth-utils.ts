import { createServerSupabaseClient } from "./supabase/server"
import { cache } from "react"
import { localAuth } from "./auth/local-auth"

// Use React cache to prevent multiple fetches of the same data
export const getUserFromSession = cache(async () => {
  // If local auth is enabled, use it instead of Supabase
  if (localAuth.isEnabled()) {
    return localAuth.getCurrentUser()
  }

  try {
    const supabase = await createServerSupabaseClient()

    if (!supabase) {
      console.error("Failed to create Supabase client")
      return null
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    // Instead of fetching from Supabase database, fetch from RDS PostgreSQL
    const userData = await getUserFromDatabase(user.id)

    if (!userData) {
      console.error("User authenticated but not found in database:", user.id)
      return null
    }

    return userData
  } catch (error) {
    console.error("Error getting user from session:", error)
    return null
  }
})

// Helper function to get user data from PostgreSQL database
async function getUserFromDatabase(userId: string) {
  try {
    const { queryOne } = await import("./db/postgres")
    return await queryOne("SELECT * FROM users WHERE id = $1", [userId])
  } catch (error) {
    console.error("Error fetching user from database:", error)
    return null
  }
}

// Check if user is admin
export async function isUserAdmin() {
  // If local auth is enabled, use it
  if (localAuth.isEnabled()) {
    const user = localAuth.getCurrentUser()
    return user?.role === "admin"
  }

  const user = await getUserFromSession()
  return user?.role === "admin"
}
