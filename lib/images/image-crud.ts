import { join } from "path";
import { query } from "../db/postgres";
import { unlink } from "fs/promises";
import { NotFoundError } from "@/handler/error";

export async function deleteEventImage(imageId: string, eventId: string) {
  try {
    // Get the image URL from the database
    const imageSql = `
    SELECT image_url 
    FROM event_images 
    WHERE id = $1 AND event_id = $2
    `;
    const image = await query(imageSql, [imageId, eventId]);

    if (!image || image.length === 0) {
      throw new Error("Image not found");
    }

    // Delete the image file from the filesystem
    const imagePath = join(process.cwd(), image[0].image_url.split("/api/")[1]);
    await unlink(imagePath);

    // Delete the image record from the database
    const deleteSql = `
    DELETE FROM event_images 
    WHERE id = $1 AND event_id = $2
      `;

    await query(deleteSql, [imageId, eventId]);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error("Error deleting image");
  }
}

export async function deletePostImage(imageId: string, postId: string) {
  const imageSql = `
    SELECT image_url 
    FROM post_images 
    WHERE id = $1 AND post_id = $2
  `;
  const image = await query(imageSql, [imageId, postId]);

  if (!image || image.length === 0) {
    throw new NotFoundError();
  }

  // Delete the image file from the filesystem
  const imagePath = join(process.cwd(), image[0].image_url.split("/api/")[1]);
  await unlink(imagePath);

  // Delete the image record from the database
  const deleteSql = `
    DELETE FROM post_images 
    WHERE id = $1 AND post_id = $2
  `;
  await query(deleteSql, [imageId, postId]);
}
