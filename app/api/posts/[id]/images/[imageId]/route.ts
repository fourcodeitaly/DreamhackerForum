import { NextResponse } from "next/server";
import { query } from "@/lib/db/postgres";
import { unlink } from "fs/promises";
import { join } from "path";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const { id, imageId } = await params;

    console.log(id, imageId);
    // Get the image URL from the database
    const imageSql = `
      SELECT image_url 
      FROM post_images 
      WHERE id = $1 AND post_id = $2
    `;
    const image = await query(imageSql, [imageId, id]);

    if (!image || image.length === 0) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Delete the image file from the filesystem
    const imagePath = join(process.cwd(), "public", image[0].image_url);
    await unlink(imagePath);

    // Delete the image record from the database
    const deleteSql = `
      DELETE FROM post_images 
      WHERE id = $1 AND post_id = $2
    `;
    await query(deleteSql, [imageId, id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Error deleting image" },
      { status: 500 }
    );
  }
}
