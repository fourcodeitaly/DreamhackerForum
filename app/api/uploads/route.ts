import { NextResponse } from "next/server";
import { uploadImages } from "@/lib/db/upload/upload";

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

    const imageUrls = await uploadImages(files, postId, eventId, eventImage);

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Error uploading files" },
      { status: 500 }
    );
  }
}
