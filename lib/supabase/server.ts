import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Check if Supabase environment variables are available
export function hasSupabaseCredentials(): boolean {
  if (typeof window === "undefined") {
    // Server-side check
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  } else {
    // Client-side check
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  }
}

// Create a single supabase client for the entire server-side application
export const createServerSupabaseClient = async () => {
  // This should only be called on the server
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables for server client")
    return null
  }

  try {
    return createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // This can happen in middleware or when cookies are already sent
            console.warn("Warning: Could not set cookie", error)
          }
        },
        remove(name, options) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 })
          } catch (error) {
            console.warn("Warning: Could not remove cookie", error)
          }
        },
      },
    })
  } catch (error) {
    console.error("Error creating server Supabase client:", error)
    return null
  }
}
