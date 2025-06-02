import { getPostById } from "@/lib/db/posts/post-get";
import {
  addSavedPost,
  deletePost,
  removeSavedPost,
} from "@/lib/db/posts/posts-modify";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { requestErrorHandler } from "@/handler/error-handler";
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "@/handler/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return requestErrorHandler(async () => {
    const { id } = await params;

    const post = await getPostById(id);

    if (!post) {
      throw new NotFoundError();
    }

    return { post };
  });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return requestErrorHandler(async () => {
    const { userId, action } = await request.json();

    if (!userId || !action) {
      throw new BadRequestError();
    }

    if (action !== "save" && action !== "unsave") {
      throw new BadRequestError();
    }

    const success =
      action === "save"
        ? await addSavedPost(userId, params.id)
        : await removeSavedPost(userId, params.id);

    if (!success) {
      throw new InternalServerError();
    }

    return { success: true };
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

    const post = await getPostById(id);
    if (!post) {
      throw new NotFoundError();
    }

    if (user.role !== "admin" && post.user_id !== user.id) {
      throw new ForbiddenError();
    }

    const success = await deletePost(id);

    if (!success) {
      throw new InternalServerError();
    }

    return { success: true };
  });
}
