import { createServerSupabaseClient } from "../supabase/server";

export type UserRole = "user" | "admin";

export type User = {
  id: string;
  username: string;
  email: string;
  name: string;
  image_url?: string;
  bio?: string;
  location?: string;
  role?: UserRole;
  joined_at: string;
  updated_at: string;
};

export async function getUserById(id: string): Promise<User | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    console.error("Supabase client not available");
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data as User;
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    console.error("Supabase client not available");
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }

  return data as User;
}

export async function updateUser(
  id: string,
  userData: Partial<User>
): Promise<User | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    console.error("Supabase client not available");
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .update({ ...userData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating user:", error);
    return null;
  }

  return data as User;
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await getUserById(userId);
  return user?.role === "admin";
}

// New function to set a user as admin
export async function setUserAsAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    console.error("Supabase client not available");
    return false;
  }

  const { error } = await supabase
    .from("users")
    .update({
      role: "admin",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error setting user as admin:", error);
    return false;
  }

  return true;
}

// New function to remove admin role from a user
export async function removeAdminRole(userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    console.error("Supabase client not available");
    return false;
  }

  const { error } = await supabase
    .from("users")
    .update({
      role: "user",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Error removing admin role:", error);
    return false;
  }

  return true;
}

// New function to get all admin users
export async function getAllAdminUsers(): Promise<User[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    console.error("Supabase client not available");
    return [];
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "admin");

  if (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }

  return data as User[];
}
