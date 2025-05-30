"use server";

import { join } from "path";
import { queryOne } from "../postgres";
import { uploadFile } from "../upload/upload";
import { mkdir } from "fs/promises";

export type UpdateProfileData = {
  name?: string;
  bio?: string;
  location?: string;
  image?: File;
};

export async function updateProfile(userId: string, data: UpdateProfileData) {
  try {
    let imageUrl = undefined;

    if (data.image) {
      const uploadImageDir = join(process.cwd(), "uploads", "images", userId);
      await mkdir(uploadImageDir, { recursive: true });
      const filename = await uploadFile(uploadImageDir, data.image);

      const uploadImageBaseUrl = `/api/uploads/images/${userId}`;
      imageUrl = `${uploadImageBaseUrl}/${filename}`;
    }

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Add each field to the update query
    if (data.name) {
      updates.push(`name = $${paramIndex}`);
      values.push(data.name);
      paramIndex++;
    }
    if (imageUrl) {
      updates.push(`image_url = $${paramIndex}`);
      values.push(imageUrl);
      paramIndex++;
    }

    // Add updated_at timestamp
    updates.push(`updated_at = $${paramIndex}`);
    values.push(new Date().toISOString());
    paramIndex++;

    // Add the user ID as the last parameter
    values.push(userId);

    // Construct the final query
    const sql = `
      UPDATE users 
      SET ${updates.join(", ")} 
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const updatedUser = await queryOne(sql, values);
    if (!updatedUser) {
      throw new Error("Failed to update user profile");
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
