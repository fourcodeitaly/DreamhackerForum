import { commentReport } from "@/lib/db/comments/comments";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { requestErrorHandler } from "@/handler/error-handler";
import { UnauthorizedError } from "@/handler/error";
import { InternalServerError } from "@/handler/error";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return requestErrorHandler(async () => {
    const { id } = await params;
    const commentId = id;

    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      throw new UnauthorizedError();
    }

    const { reason } = await request.json();

    const report = await commentReport(commentId, user.id, reason);

    if (!report) {
      throw new InternalServerError();
    }

    return { success: true };
  });
}
