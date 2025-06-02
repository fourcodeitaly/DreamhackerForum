import { deletePostImage } from "@/lib/images/image-crud";
import { requestErrorHandler } from "@/handler/error-handler";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  return requestErrorHandler(async () => {
    const { id, imageId } = await params;

    await deletePostImage(imageId, id);

    return { success: true };
  });
}
