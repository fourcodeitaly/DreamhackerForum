import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteEventImage } from "@/lib/images/image-crud";
import { requestErrorHandler } from "@/handler/error-handler";
import { UnauthorizedError } from "@/handler/error";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; imageId: string } }
) {
  return requestErrorHandler(async () => {
    const { id, imageId } = await params;

    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      throw new UnauthorizedError();
    }

    await deleteEventImage(imageId, id);

    return { success: true };
  });
}
