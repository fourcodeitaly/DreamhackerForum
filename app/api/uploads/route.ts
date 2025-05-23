import { NextResponse } from "next/server";
import { readdir, readFile, writeFile } from "fs/promises";
import path, { join } from "path";
import { mkdir } from "fs/promises";
import { query } from "@/lib/db/postgres";

// const eventImageUpload = async (
//   eventId: string,
//   eventImage: File,
// ): Promise<void> => {
//   try {
//       const uploadDir = join(
//         process.cwd(),
//         "uploads",
//         "images",
//         "events",
//         eventId
//       );
//       await mkdir(uploadDir, { recursive: true });
//       const path = join(uploadDir, renamedEventImage.name);
//       const bytes = await renamedEventImage.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       await writeFile(path, buffer);
//       const imageUrl = `/api/uploads/images/events/${eventId}/${renamedEventImage.name}`;
//       await query(
//         `INSERT INTO event_images (event_id, image_url, display_order)
//      VALUES ($1, $2, $3)`,
//         [eventId, imageUrl, 0]
//       );
//     }
//   } catch (error) {
//     console.error("Error uploading event image:", error);
//     return null;
//   }
// };

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const postId = formData.get("postId") as string;
    const eventId = formData.get("eventId") as string;
    const eventImage = formData.get("eventImage") as File;

    if (!postId && !eventId) {
      return NextResponse.json(
        { error: "No post ID or event ID provided" },
        { status: 400 }
      );
    }

    if (postId && eventId) {
      return NextResponse.json(
        { error: "Both post ID and event ID provided" },
        { status: 400 }
      );
    }

    if (postId && !files) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (eventId && !eventImage) {
      return NextResponse.json(
        { error: "No event image uploaded" },
        { status: 400 }
      );
    }

    let insertTable: string;
    let insertId: string;
    let insertColumn: string;

    if (postId) {
      insertTable = "post_images";
      insertColumn = "post_id";
      insertId = postId;
    } else {
      insertTable = "event_images";
      insertColumn = "event_id";
      insertId = eventId;
    }

    const uploadDir = join(process.cwd(), "uploads", "images", insertId);
    await mkdir(uploadDir, { recursive: true });

    if (eventImage) {
      const bytes = await eventImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-event-image`;
      const path = join(uploadDir, filename);

      // Write file to disk
      await writeFile(path, buffer);

      // Get the relative path to the image
      const imageUrl = `/api/uploads/images/${insertId}/${filename}`;

      // Save image URL to database
      const insertQuery = `INSERT INTO ${insertTable} (${insertColumn}, image_url, display_order) 
         VALUES ($1, $2, $3)`;
      await query(insertQuery, [insertId, imageUrl, 0]);
    }

    const imageUrls = [];

    // Create directory for post images if it doesn't exist

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
      const imageUrl = `/api/uploads/images/${insertId}/${filename}`;
      imageUrls.push(imageUrl);

      // Save image URL to database
      await query(
        `INSERT INTO ${insertTable} (${insertColumn}, image_url, display_order) 
         VALUES ($1, $2, $3)`,
        [insertId, imageUrl, imageUrls.length]
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
