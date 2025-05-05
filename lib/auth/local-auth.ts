// Local authentication bypass for development environments
// This allows testing without Supabase Auth in local development

type LocalUser = {
  id: string
  email: string
  name: string
  username: string
  role: string
  image_url?: string
}

class LocalAuth {
  private enabled: boolean
  private currentUser: LocalUser | null = null
  private users: LocalUser[] = [
    {
      id: "00000000-0000-0000-0000-000000000001",
      email: "admin@example.com",
      name: "Admin User",
      username: "admin",
      role: "admin",
      image_url: "/images/user-avatar-1.png",
    },
    {
      id: "00000000-0000-0000-0000-000000000002",
      email: "user@example.com",
      name: "Regular User",
      username: "user",
      role: "user",
      image_url: "/images/user-avatar-2.png",
    },
  ]

  constructor() {
    // Check if local auth is enabled via environment variable
    this.enabled = process.env.USE_LOCAL_AUTH === "true"
  }

  isEnabled(): boolean {
    return this.enabled
  }

  getCurrentUser(): LocalUser | null {
    return this.currentUser
  }

  login(email: string): LocalUser | null {
    const user = this.users.find((u) => u.email === email)
    if (user) {
      this.currentUser = user
      // Store in localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("localAuthUser", JSON.stringify(user))
      }
      return user
    }
    return null
  }

  logout(): void {
    this.currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("localAuthUser")
    }
  }

  // Initialize from localStorage if available
  initialize(): void {
    if (this.enabled && typeof window !== "undefined") {
      const storedUser = localStorage.getItem("localAuthUser")
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser)
        } catch (e) {
          console.error("Error parsing stored user:", e)
          localStorage.removeItem("localAuthUser")
        }
      }
    }
  }

  // Get all available users (for development UI)
  getAvailableUsers(): LocalUser[] {
    return this.users
  }
}

// Create a singleton instance
export const localAuth = new LocalAuth()

// Initialize on import if in browser
if (typeof window !== "undefined") {
  localAuth.initialize()
}
