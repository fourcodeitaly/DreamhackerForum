"use server"

import { queryOne } from "@/lib/db/postgres"
import type { User } from "@/lib/db/users"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function getUserData(userId: string) {
  try {
    const userData = await queryOne<User>(
      `SELECT 
        id,
        email,
        username,
        image_url,
        role
      FROM users 
      WHERE id = $1`,
      [userId],
    )
    return { user: userData, error: null }
  } catch (error) {
    console.error("Error fetching user data:", error)
    return { user: null, error: "Failed to fetch user data" }
  }
}

export async function loginUser(credentials: {
  email: string
  password: string
}) {
  try {
    const supabase = await createServerSupabaseClient()

    if (!supabase) {
      throw new Error("Failed to create Supabase client")
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) throw error

    if (data.user) {
      const { user, error: userError } = await getUserData(data.user.id)
      if (userError) throw new Error(userError)
      return { user, error: null }
    }

    return { user: null, error: "No user data found" }
  } catch (error) {
    console.error("Login error:", error)
    return {
      user: null,
      error: error instanceof Error ? error.message : "Login failed",
    }
  }
}

export async function registerUser(userData: {
  email: string
  password: string
  name: string
  username: string
}) {
  try {
    const supabase = await createServerSupabaseClient()

    if (!supabase) {
      throw new Error("Failed to create Supabase client")
    }

    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
          username: userData.username,
        },
      },
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      data: null,
      error: error instanceof Error ? error.message : "Registration failed",
    }
  }
}

export async function resendConfirmationEmailServer(email: string) {
  try {
    const supabase = await createServerSupabaseClient()

    if (!supabase) {
      throw new Error("Failed to create Supabase client")
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    })
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error("Resend confirmation error:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to resend confirmation email",
    }
  }
}

export async function logoutUser() {
  try {
    const supabase = await createServerSupabaseClient()

    if (!supabase) {
      throw new Error("Failed to create Supabase client")
    }

    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error("Logout error:", error)
    return { error: error instanceof Error ? error.message : "Logout failed" }
  }
}
