"use server";

import { queryOne } from "@/lib/db/postgres";
import type { User } from "@/lib/db/users-get";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
      [userId]
    );
    return { user: userData, error: null };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return { user: null, error: "Failed to fetch user data" };
  }
}

export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      throw new Error("Failed to create Supabase client");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

    if (data.user) {
      const { user, error: userError } = await getUserData(data.user.id);
      if (userError) throw new Error(userError);
      return { user, error: null };
    }

    return { user: null, error: "No user data found" };
  } catch (error) {
    console.error("Login error:", error);
    return {
      user: null,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function registerUser(userData: {
  email: string;
  password: string;
  name: string;
  username: string;
}) {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      throw new Error("Failed to create Supabase client");
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
    });

    if (error) throw error;

    // If signup was successful and we have a user, create the user in PostgreSQL
    if (data.user) {
      const now = new Date().toISOString();
      const { error: dbError } = await queryOne(
        `INSERT INTO users (
          id,
          email,
          name,
          username,
          role,
          joined_at,
          updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
          data.user.id,
          userData.email,
          userData.name,
          userData.username,
          "user", // Default role
          now,
          now,
        ]
      );

      if (dbError) {
        console.error("Error creating user in database:", dbError);
        // You might want to handle this error appropriately
        // For example, you could delete the Supabase auth user if DB insert fails
        return { data: null, error: "Failed to create user in database" };
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

export async function resendConfirmationEmailServer(email: string) {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      throw new Error("Failed to create Supabase client");
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Resend confirmation error:", error);
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to resend confirmation email",
    };
  }
}

export async function logoutUser() {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      throw new Error("Failed to create Supabase client");
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error("Logout error:", error);
    return { error: error instanceof Error ? error.message : "Logout failed" };
  }
}
