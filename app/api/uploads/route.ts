import { NextResponse } from "next/server";
import { uploadImages } from "@/lib/db/upload/upload";
import { requestErrorHandler } from "@/handler/error-handler";
import { InternalServerError } from "@/handler/error";
import { BadRequestError } from "@/handler/error";

export async function POST(request: Request) {
  return requestErrorHandler(async () => {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const postId = formData.get("postId") as string;
    const eventId = formData.get("eventId") as string;
    const eventImage = formData.get("eventImage") as File;

    if (!postId && !eventId) {
      throw new BadRequestError();
    }

    if (postId && eventId) {
      throw new BadRequestError();
    }

    if (postId && !files) {
      throw new BadRequestError();
    }

    if (eventId && !eventImage) {
      throw new BadRequestError();
    }

    const imageUrls = await uploadImages(files, postId, eventId, eventImage);

    return { imageUrls };
  });
}
