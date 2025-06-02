import {
  getCommentsByPostId,
  createComment,
  commentSort,
} from "@/lib/db/comments/comments";
import type { CommentSortType } from "@/lib/types/comment";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { requestErrorHandler } from "@/handler/error-handler";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  InternalServerError,
} from "@/handler/error";

export async function GET(request: Request) {
  return requestErrorHandler(async () => {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("post_id");
    const parentId = searchParams.get("parent_id") || null;
    const sort = searchParams.get("sort") || "top";
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "50");

    if (!postId) {
      throw new BadRequestError();
    }

    // Get current user for like status
    const session = await getServerSession(authOptions);
    const user = session?.user;
    // Get comments using the new PostgreSQL function
    const comments = await getCommentsByPostId(postId, user?.id);

    if (!comments) {
      throw new NotFoundError();
    }

    const { comments: processedComments, pagination } = await commentSort(
      comments,
      postId,
      user?.id,
      parentId,
      sort as CommentSortType,
      page,
      limit
    );

    return {
      comments: processedComments,
      pagination: {
        page,
        limit,
        hasMore: pagination.hasMore,
      },
    };
  });
}

export async function POST(request: Request) {
  return requestErrorHandler(async () => {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      throw new UnauthorizedError();
    }

    const { post_id, parent_id, content, is_markdown } = await request.json();

    if (!post_id || !content) {
      throw new BadRequestError();
    }

    // Create new comment using the new PostgreSQL function
    const comment = await createComment({
      post_id,
      user_id: user.id,
      parent_id: parent_id || undefined,
      content,
      upvotes: 0,
      downvotes: 0,
      status: "active",
      is_markdown: is_markdown || false,
      is_edited: false,
      edited_at: null,
    });

    if (!comment) {
      throw new InternalServerError();
    }

    return {
      comment: {
        ...comment,
        reply_count: 0,
      },
    };
  });
}
