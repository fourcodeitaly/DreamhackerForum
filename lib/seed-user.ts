import { createServerSupabaseClient } from "./supabase"

export async function seedTestUser() {
  const supabase = createServerSupabaseClient()

  if (!supabase) {
    console.error("Supabase client not available")
    return null
  }

  try {
    // Check if test user already exists
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail("test@example.com")

    if (existingUser?.user) {
      console.log("Test user already exists")
      return existingUser.user
    }

    // Create test user in auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: "test@example.com",
      password: "password123",
      email_confirm: true,
      user_metadata: {
        name: "Test User",
        username: "testuser",
      },
    })

    if (error) {
      console.error("Error creating test user:", error)
      return null
    }

    // Create user profile in users table
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email: data.user.email!,
          name: "Test User",
          username: "testuser",
        },
      ])

      if (profileError) {
        console.error("Error creating user profile:", profileError)
      }
    }

    console.log("Test user created successfully")
    return data.user
  } catch (error) {
    console.error("Error seeding test user:", error)
    return null
  }
}
