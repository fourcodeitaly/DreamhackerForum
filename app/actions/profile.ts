"use server";

import { queryOne } from "@/lib/db/postgres";
import { writeFile } from "fs/promises";
import { join } from "path";

interface ProfileUpdateData {
  name: string;
  bio: string;
  location: string;
  image?: File;
}

export async function updateProfile(userId: string, data: ProfileUpdateData) {
  try {
    let avatarUrl = null;

    // Handle image upload if provided
    if (data.image) {
      const bytes = await data.image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const uniqueId = crypto.randomUUID();
      const extension = data.image.name.split(".").pop();
      const filename = `${uniqueId}.${extension}`;

      // Save to public directory
      const publicDir = join(process.cwd(), "public", "avatars");
      const filepath = join(publicDir, filename);
      await writeFile(filepath, buffer);

      // Set the avatar URL
      avatarUrl = `/avatars/${filename}`;
    }

    // Update user profile
    const result = await queryOne(
      `UPDATE users 
       SET 
        full_name = $1,
        bio = $2,
        location = $3,
        image_url = COALESCE($4, image_url),
        updated_at = NOW()
       WHERE id = $5
       RETURNING 
        id,
        name,
        bio,
        location,
        image_url,
        updated_at`,
      [data.name, data.bio, data.location, avatarUrl, userId]
    );

    if (!result) {
      throw new Error("Failed to update profile");
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
