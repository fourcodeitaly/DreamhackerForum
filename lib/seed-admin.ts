import { createServerSupabaseClient } from "./supabase";

export async function seedAdminUser() {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    console.error("Supabase client not available");
    return null;
  }

  try {
    // Check if admin user already exists
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(
      "admin@example.com"
    );

    if (existingUser?.user) {
      console.log("Admin user already exists");

      // Ensure the user has admin role
      const { error: updateError } = await supabase
        .from("users")
        .update({ role: "admin" })
        .eq("id", existingUser.user.id);

      if (updateError) {
        console.error("Error updating admin role:", updateError);
      }

      return existingUser.user;
    }

    // Create admin user in auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: "admin@example.com",
      password: "adminpassword123",
      email_confirm: true,
      user_metadata: {
        name: "Admin User",
        username: "admin",
      },
    });

    if (error) {
      console.error("Error creating admin user:", error);
      return null;
    }

    // Update user role to admin
    if (data.user) {
      const { error: updateError } = await supabase
        .from("users")
        .update({ role: "admin" })
        .eq("id", data.user.id);

      if (updateError) {
        console.error("Error updating admin role:", updateError);
      }
    }

    console.log("Admin user created successfully");
    return data.user;
  } catch (error) {
    console.error("Error seeding admin user:", error);
    return null;
  }
}
