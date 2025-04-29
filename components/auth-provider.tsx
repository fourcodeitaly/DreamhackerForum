"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createSafeClientSupabaseClient } from "@/lib/supabase"
import { getMockCurrentUser } from "@/lib/mock-data"
import type { User } from "@/lib/db/users"

interface AuthContextType {
  user: User | null
  login: (credentials: { email: string; password: string }) => Promise<void>
  register: (userData: { email: string; password: string; name: string; username: string }) => Promise<void>
  logout: () => Promise<void>
  resendConfirmationEmail: (email: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const supabase = createSafeClientSupabaseClient()

        if (!supabase) {
          // If Supabase client couldn't be created, use mock user
          console.log("Using mock user data")
          setUser(getMockCurrentUser() as User)
          setIsLoading(false)
          return
        }

        // Check if user is already logged in
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          try {
            // Get user profile from the users table
            const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

            if (userData) {
              setUser(userData as User)
            }
          } catch (error) {
            console.error("Error getting user data:", error)
            // Fall back to mock user
            setUser(getMockCurrentUser() as User)
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
              // Fall back to mock user
              setUser(getMockCurrentUser() as User)
            }
          } else {
            setUser(null)
          }
        })

        setIsLoading(false)

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        // Fall back to mock user
        setUser(getMockCurrentUser() as User)
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    const supabase = createSafeClientSupabaseClient()

    if (!supabase) {
      // Mock login
      setUser(getMockCurrentUser() as User)
      return
    }

    const { error, data } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      throw error
    }
  }

  const register = async (userData: { email: string; password: string; name: string; username: string }) => {
    const supabase = createSafeClientSupabaseClient()

    if (!supabase) {
      // Mock register
      setUser(getMockCurrentUser() as User)
      return
    }

    // Register with Supabase Auth
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

  const resendConfirmationEmail = async (email: string) => {
    const supabase = createSafeClientSupabaseClient()

    if (!supabase) {
      // Mock resend
      return
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    })

    if (error) {
      throw error
    }
  }

  const logout = async () => {
    const supabase = createSafeClientSupabaseClient()

    if (!supabase) {
      // Mock logout
      setUser(null)
      return
    }

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
        resendConfirmationEmail,
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
