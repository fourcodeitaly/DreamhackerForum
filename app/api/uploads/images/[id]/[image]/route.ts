import { NextResponse } from "next/server";
import path, { join } from "path";
import fs from "fs/promises";

async function checkFileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true; // File exists
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false; // File does not exist
    }
    throw error; // Other errors (e.g., permission issues)
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string; image: string } }
) {
  try {
    const { id, image } = await params;

    const imagePath = join(process.cwd(), "uploads", "images", id, image);

    const exists = await checkFileExists(imagePath);

    if (!exists) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Validate filename to prevent path traversal attacks
    if (!image || typeof image !== "string" || image.includes("..")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    try {
      const fileBuffer = await fs.readFile(imagePath);
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
