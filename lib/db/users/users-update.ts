"use server";

import { join } from "path";
import { query, transaction } from "../postgres";
import { uploadFile } from "../upload/upload";
import { mkdir } from "fs/promises";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type UpdateProfileData = {
  name?: string;
  bio?: string;
  location?: string;
  image?: File;
  educations?: {
    school_name: string;
    degree?: string;
    field_of_study?: string;
    start_date?: string;
    end_date?: string;
    is_current?: boolean;
  }[];
};

export async function updateProfile(userId: string, data: UpdateProfileData) {
  try {
    return await transaction(async (client) => {
      const user = await getServerSession(authOptions);

      if (!user) {
        throw new Error("Unauthorized");
      }

      if (user.user.id !== userId) {
        throw new Error("Unauthorized");
      }

      let imageUrl = undefined;

      if (data.image) {
        const uploadImageDir = join(process.cwd(), "uploads", "images", userId);
        await mkdir(uploadImageDir, { recursive: true });
        const filename = await uploadFile(uploadImageDir, data.image);

        const uploadImageBaseUrl = `/api/uploads/images/${userId}`;
        imageUrl = `${uploadImageBaseUrl}/${filename}`;
      }

      // Build dynamic update query for user profile
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      // Add each field to the update query
      if (data.name) {
        updates.push(`name = $${paramIndex}`);
        values.push(data.name);
        paramIndex++;
      }
      if (data.bio) {
        updates.push(`bio = $${paramIndex}`);
        values.push(data.bio);
        paramIndex++;
      }
      if (data.location) {
        updates.push(`location = $${paramIndex}`);
        values.push(data.location);
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

      // Update user profile
      const userSql = `
        UPDATE users 
        SET ${updates.join(", ")} 
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const updatedUser = await query(userSql, values);

      // Handle education updates if provided
      if (data.educations) {
        // Delete existing educations
        await query("DELETE FROM user_education WHERE user_id = $1", [userId]);

        // Insert new educations
        if (data.educations.length > 0) {
          const educationValues = data.educations.map((edu) => [
            userId,
            edu.school_name,
            edu.degree,
            edu.field_of_study,
            edu.start_date,
            edu.end_date,
            edu.is_current || false,
            new Date().toISOString(),
            new Date().toISOString(),
          ]);

          const educationSql = `
            INSERT INTO user_education (
              user_id, school_name, degree, field_of_study, 
              start_date, end_date, is_current, created_at, updated_at
            )
            VALUES ${educationValues
              .map(
                (_, i) =>
                  `($${i * 9 + 1}, $${i * 9 + 2}, $${i * 9 + 3}, $${i * 9 + 4}, 
                $${i * 9 + 5}, $${i * 9 + 6}, $${i * 9 + 7}, $${i * 9 + 8}, $${
                    i * 9 + 9
                  })`
              )
              .join(", ")}
            RETURNING *
          `;

          await query(educationSql, educationValues.flat());
        }
      }

      return updatedUser;
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}
