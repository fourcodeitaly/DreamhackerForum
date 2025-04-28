"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getMockCurrentUser } from "@/lib/mock-data"

interface AuthContextType {
  user: any | null
  login: (credentials: any) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    // Check if there's a saved auth state
    const savedAuth = localStorage.getItem("auth")
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth)
        if (parsedAuth.isLoggedIn) {
          // Simulate fetching user data
          const mockUser = getMockCurrentUser()
          setUser(mockUser)
        }
      } catch (error) {
        console.error("Error parsing auth data:", error)
        localStorage.removeItem("auth")
      }
    }
  }, [])

  const login = async (credentials: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get mock user
    const mockUser = getMockCurrentUser()
    setUser(mockUser)

    // Save auth state
    localStorage.setItem(
      "auth",
      JSON.stringify({
        isLoggedIn: true,
        email: credentials.email,
      }),
    )
  }

  const register = async (userData: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get mock user
    const mockUser = getMockCurrentUser()
    setUser(mockUser)

    // Save auth state
    localStorage.setItem(
      "auth",
      JSON.stringify({
        isLoggedIn: true,
        email: userData.email,
      }),
    )
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth")
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
