import { createServerSupabaseClient } from "../supabase"

export type User = {
  id: string
  username: string
  email: string
  name: string
  image_url?: string
  bio?: string
  location?: string
  joined_at: string
  updated_at: string
}

export async function getUserById(id: string): Promise<User | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching user:", error)
    return null
  }

  return data as User
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("users").select("*").eq("username", username).single()

  if (error) {
    console.error("Error fetching user by username:", error)
    return null
  }

  return data as User
}

export async function createUser(userData: Omit<User, "id" | "joined_at" | "updated_at">): Promise<User | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("users").insert([userData]).select().single()

  if (error) {
    console.error("Error creating user:", error)
    return null
  }

  return data as User
}

export async function updateUser(id: string, userData: Partial<User>): Promise<User | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("users")
    .update({ ...userData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating user:", error)
    return null
  }

  return data as User
}
