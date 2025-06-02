import {
  markNotificationAsRead,
  deleteNotification,
} from "@/lib/db/notification";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { requestErrorHandler } from "@/handler/error-handler";
import { UnauthorizedError } from "@/handler/error";
import { NotFoundError } from "@/handler/error";
import { InternalServerError } from "@/handler/error";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  return requestErrorHandler(async () => {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      throw new UnauthorizedError();
    }

    const notification = await markNotificationAsRead(id, user.id);

    if (!notification) {
      throw new NotFoundError();
    }

    return { notification };
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return requestErrorHandler(async () => {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      throw new UnauthorizedError();
    }

    const success = await deleteNotification(id, user.id);

    if (!success) {
      throw new NotFoundError();
    }

    return { success: true };
  });
}
