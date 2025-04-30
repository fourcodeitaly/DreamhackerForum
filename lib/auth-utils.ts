import { createServerSupabaseClient } from "./supabase/server"
import { cache } from "react"

// Use React cache to prevent multiple fetches of the same data
export const getUserFromSession = cache(async () => {
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

    const { data: userData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching user data:", error)
      return null
    }

    return userData
  } catch (error) {
    console.error("Error getting user from session:", error)
    return null
  }
})

// Check if user is admin
export async function isUserAdmin() {
  const user = await getUserFromSession()
  return user?.role === "admin"
}
