import { markAllNotificationsAsRead } from "@/lib/db/notification";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { requestErrorHandler } from "@/handler/error-handler";
import { UnauthorizedError } from "@/handler/error";

export async function POST(request: Request) {
  return requestErrorHandler(async () => {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      throw new UnauthorizedError();
    }

    const count = await markAllNotificationsAsRead(user.id);

    return {
      success: true,
      count,
    };
  });
}
