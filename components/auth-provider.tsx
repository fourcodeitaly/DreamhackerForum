"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createSafeClientSupabaseClient } from "@/lib/supabase"
import type { User } from "@/lib/db/users"

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  isAuthenticated: boolean
  login: any
  register: any
  logout: () => Promise<void>
  resendConfirmationEmail: (email: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Derived state
  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true)
        // Always use the client Supabase client on the client side
        const supabase = createSafeClientSupabaseClient()

        if (!supabase) {
          console.error("Failed to create Supabase client")
          setUser(null)
          setIsLoading(false)
          return
        }

        // Check if user is already logged in
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          try {
            // Get user profile from the users table - this will now use the synced UUID
            const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

            if (userData) {
              setUser(userData as User)
            } else {
              console.warn("User authenticated but no profile found in users table")
              setUser(null)
            }
          } catch (error) {
            console.error("Error getting user data:", error)
            setUser(null)
          }
        } else {
          setUser(null)
        }

        // Set up auth state listener
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.id)
          if (session) {
            try {
              // Get user profile from the users table
              const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

              if (userData) {
                setUser(userData as User)
              } else {
                console.warn("Auth state changed but no profile found in users table")
                setUser(null)
              }
            } catch (error) {
              console.error("Error getting user data:", error)
              setUser(null)
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
        setUser(null)
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    const supabase = createSafeClientSupabaseClient()

    if (!supabase) {
      throw new Error("Supabase client not available")
    }

    const { error, data } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      throw error
    }

    // Explicitly fetch and set the user after successful login
    if (data.user) {
      try {
        const { data: userData } = await supabase.from("users").select("*").eq("id", data.user.id).single()

        if (userData) {
          setUser(userData as User)
        } else {
          console.warn("Login successful but no profile found in users table")
        }
      } catch (fetchError) {
        console.error("Error fetching user data after login:", fetchError)
      }
    }

    return data
  }

  const register = async (userData: {
    email: string
    password: string
    name: string
    username: string
  }) => {
    const supabase = createSafeClientSupabaseClient()

    if (!supabase) {
      throw new Error("Supabase client not available")
    }

    // Register with Supabase Auth - the trigger will automatically create the user in the users table
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

    // No need to manually insert into users table anymore - the trigger handles it
    // Just return the data
    return data
  }

  const resendConfirmationEmail = async (email: string) => {
    const supabase = createSafeClientSupabaseClient()

    if (!supabase) {
      throw new Error("Supabase client not available")
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
      // No Supabase client, just clear local state
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
        isAdmin,
        isAuthenticated,
        login,
        register,
        logout,
        resendConfirmationEmail,
        isLoading,
      }}
    >
      {children}
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
