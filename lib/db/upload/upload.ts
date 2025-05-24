import { join } from "path";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import { query } from "../postgres";

async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true; // File exists
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false; // File does not exist
    }
    throw error; // Other errors (e.g., permission issues)
  }
}

export async function getFile(
  path: string,
  filename?: string
): Promise<Buffer> {
  const filePath = join(process.cwd(), "uploads", path);

  const exists = await checkFileExists(filePath);

  if (!exists) {
    throw new Error("Image not found");
  }

  // Validate filename to prevent path traversal attacks
  if (filename) {
    if (typeof filename !== "string" || filename.includes("..")) {
      throw new Error("Invalid filename");
    }
  }

  const fileBuffer = await readFile(filePath);

  return fileBuffer;
}

export async function uploadFile(
  uploadDir: string,
  file: File,
  newName?: string
) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const timestamp = Date.now();
  const filename = timestamp + "-" + (newName || file.name);
  const path = join(uploadDir, filename);

  // Write file to disk
  await writeFile(path, buffer);

  return filename;
}

export async function uploadImages(
  files: File[],
  postId?: string,
  eventId?: string,
  eventMainImage?: File
) {
  const insertId = postId || eventId;

  if (!insertId) {
    throw new Error("No post ID or event ID provided");
  }

  const uploadImageDir = join(process.cwd(), "uploads", "images", insertId);
  const uploadImageBaseUrl = `/api/uploads/images/${insertId}`;

  await mkdir(uploadImageDir, { recursive: true });

  if (eventMainImage) {
    // Get the relative path to the image
    const filename = await uploadFile(
      uploadImageDir,
      eventMainImage,
      "event-image"
    );
    const eventImageUrl = `${uploadImageBaseUrl}/${filename}`;

    await insertEventImage(insertId, eventImageUrl, 0);
  }

  const imageUrls = [];

  for (const file of files) {
    const filename = await uploadFile(uploadImageDir, file);
    const imageUrl = `${uploadImageBaseUrl}/${filename}`;
    imageUrls.push(imageUrl);

    // Save image URL to database
    if (postId) {
      await insertPostImage(insertId, imageUrl, imageUrls.length);
    }

    if (eventId) {
      await insertEventImage(insertId, imageUrl, imageUrls.length);
    }
  }

  return imageUrls;
}

export async function insertPostImage(
  postId: string,
  imageUrl: string,
  displayOrder: number
) {
  try {
    const insertQuery = `INSERT INTO post_images (post_id, image_url, display_order) 
     VALUES ($1, $2, $3)`;
    await query(insertQuery, [postId, imageUrl, displayOrder]);
  } catch (error) {
    console.error("Error inserting post image:", error);
    throw error;
  }
}

export async function insertEventImage(
  eventId: string,
  imageUrl: string,
  displayOrder: number
) {
  try {
    const insertQuery = `INSERT INTO event_images (event_id, image_url, display_order) 
     VALUES ($1, $2, $3)`;
    await query(insertQuery, [eventId, imageUrl, displayOrder]);
  } catch (error) {
    console.error("Error inserting event image:", error);
    throw error;
  }
}
