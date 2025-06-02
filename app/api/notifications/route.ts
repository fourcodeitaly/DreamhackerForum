import { getNotifications, createNotification } from "@/lib/db/notification";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { requestErrorHandler } from "@/handler/error-handler";
import { BadRequestError, UnauthorizedError } from "@/handler/error";

export async function GET(request: Request) {
  return requestErrorHandler(async () => {
    const user = await getServerSession(authOptions);
    if (!user) {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type");
    const isRead = searchParams.get("is_read");

    const result = await getNotifications(user.user?.id, {
      page,
      limit,
      type: type || undefined,
      isRead: isRead === "true",
    });

    return result;
  });
}

export async function POST(request: Request) {
  return requestErrorHandler(async () => {
    const user = await getServerSession(authOptions);
    if (!user) {
      throw new UnauthorizedError();
    }

    const body = await request.json();
    const { user_id, type, content, link, sender_id } = body;

    if (!user_id || !type || !content) {
      throw new BadRequestError();
    }

    const notification = await createNotification({
      user_id,
      type,
      content,
      link,
      sender_id,
    });

    return { notification };
  });
}
