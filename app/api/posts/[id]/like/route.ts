import { handlePostLike } from "@/lib/db/posts/post-likes";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { requestErrorHandler } from "@/handler/error-handler";
import { UnauthorizedError } from "@/handler/error";
import { InternalServerError } from "@/handler/error";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return requestErrorHandler(async () => {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      throw new UnauthorizedError();
    }

    const result = await handlePostLike(id, user.id);

    if (!result) {
      throw new InternalServerError();
    }

    return { result };
  });
}
