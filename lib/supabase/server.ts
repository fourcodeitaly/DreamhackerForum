import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { localAuth } from "../auth/local-auth"

// Check if Supabase environment variables are available
export function hasSupabaseCredentials(): boolean {
  // If local auth is enabled, we don't need Supabase credentials
  if (localAuth.isEnabled()) {
    return true
  }

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
  // If local auth is enabled in development, return null as we'll use local auth instead
  if (localAuth.isEnabled()) {
    return null
  }

  try {
    // This should only be called on the server
    const cookieStore = await cookies()

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables for server client")
      return null
    }

    return createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    })
  } catch (error) {
    console.error("Error creating server Supabase client:", error)
    return null
  }
}

// Add the missing createClient export that was causing the deployment error
// This is an alias for createServerSupabaseClient for backward compatibility
export const createClient = createServerSupabaseClient
