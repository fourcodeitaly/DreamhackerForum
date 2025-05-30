"use server";

import { queryOne } from "@/lib/db/postgres";
import type { User } from "@/lib/db/users/users-get";

export async function getUserData(userId: string) {
  try {
    const userData = await queryOne<User>(
      `SELECT 
        id,
        email,
        username,
        image_url,
        name,
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
