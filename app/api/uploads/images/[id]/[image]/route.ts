import { extname, join } from "path";
import { requestErrorHandler } from "@/handler/error-handler";
import { getFile } from "@/lib/db/upload/upload";

export async function GET(
  request: Request,
  { params }: { params: { id: string; image: string } }
) {
  return requestErrorHandler(async () => {
    const { id, image } = await params;

    const path = join("images", id, image);

    const fileBuffer = await getFile(path, image);

    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
    };

    const ext = extname(image).toLowerCase();
    const contentType =
      mimeTypes[ext as keyof typeof mimeTypes] || "application/octet-stream";

    // Set headers and send the file
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  });
}
