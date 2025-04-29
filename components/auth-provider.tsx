"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClientSupabaseClient } from "@/lib/supabase"
import type { User } from "@/lib/db/users"

interface AuthContextType {
  user: User | null
  login: (credentials: { email: string; password: string }) => Promise<void>
  register: (userData: { email: string; password: string; name: string; username: string }) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClientSupabaseClient()

    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // Get user profile from the users table
          const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          if (userData) {
            setUser(userData as User)
          }
        }
      } catch (error) {
        console.error("Error checking auth session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        try {
          // Get user profile from the users table
          const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

          if (userData) {
            setUser(userData as User)
          }
        } catch (error) {
          console.error("Error getting user data:", error)
        }
      } else {
        setUser(null)
      }
    })

    checkUser()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    const supabase = createClientSupabaseClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      throw error
    }
  }

  const register = async (userData: { email: string; password: string; name: string; username: string }) => {
    const supabase = createClientSupabaseClient()

    // Register with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    })

    if (error) {
      throw error
    }

    if (data.user) {
      // Create user profile in the users table
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: userData.email,
          name: userData.name,
          username: userData.username,
        },
      ])

      if (profileError) {
        throw profileError
      }
    }
  }

  const logout = async () => {
    const supabase = createClientSupabaseClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
