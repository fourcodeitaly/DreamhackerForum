import { existsSync, readFileSync } from "fs";
import { NextResponse } from "next/server";
import path, { join } from "path";

export async function GET(
  request: Request,
  { params }: { params: { postId: string; image: string } }
) {
  try {
    const { postId, image } = await params;
    console.log(postId, image);
    const imagePath = join(
      process.cwd(),
      "uploads",
      "images",
      "posts",
      postId,
      image
    );

    if (!existsSync(imagePath)) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Validate filename to prevent path traversal attacks
    if (!image || typeof image !== "string" || image.includes("..")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    try {
      // Read the file
      const fileBuffer = readFileSync(imagePath);
      const ext = path.extname(image).toLowerCase();
      const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
      };
      const contentType =
        mimeTypes[ext as keyof typeof mimeTypes] || "application/octet-stream";

      // Set headers and send the file
      return new Response(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch (error) {
      console.error("Error serving image:", error);
      return NextResponse.json(
        { error: "Error serving image" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json({ error: "Error serving image" }, { status: 500 });
  }
}
