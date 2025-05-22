import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { mkdir } from "fs/promises";
import { query } from "@/lib/db/postgres";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const postId = formData.get("postId") as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (!postId) {
      return NextResponse.json(
        { error: "No post ID provided" },
        { status: 400 }
      );
    }

    // Create directory for post images if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "images", "posts", postId);
    await mkdir(uploadDir, { recursive: true });

    const imageUrls = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${file.name}`;
      const path = join(uploadDir, filename);

      // Write file to disk
      await writeFile(path, buffer);

      // Get the relative path to the image
      const imageUrl = `/images/posts/${postId}/${filename}`;
      imageUrls.push(imageUrl);

      // Save image URL to database
      await query(
        `INSERT INTO post_images (post_id, image_url, display_order) 
         VALUES ($1, $2, $3)`,
        [postId, imageUrl, imageUrls.length - 1]
      );
    }

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Error uploading files" },
      { status: 500 }
    );
  }
}
