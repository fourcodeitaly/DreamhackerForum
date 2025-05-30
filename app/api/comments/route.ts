import { NextResponse } from "next/server";
import {
  getCommentsByPostId,
  createComment,
  commentSort,
} from "@/lib/db/comments/comments";
import type { CommentSortType } from "@/lib/types/comment";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("post_id");
  const parentId = searchParams.get("parent_id") || null;
  const sort = searchParams.get("sort") || "top";
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "50");

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
  }

  // Get current user for like status
  const session = await getServerSession();
  const user = session?.user;

  try {
    // Get comments using the new PostgreSQL function
    const comments = await getCommentsByPostId(postId, user?.id);

    const { comments: processedComments, pagination } = await commentSort(
      comments,
      postId,
      user?.id,
      parentId,
      sort as CommentSortType,
      page,
      limit
    );

    return NextResponse.json({
      comments: processedComments,
      pagination: {
        page,
        limit,
        hasMore: pagination.hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { post_id, parent_id, content, is_markdown } = await request.json();

    if (!post_id || !content) {
      return NextResponse.json(
        { error: "Post ID and content are required" },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: "Failed to create comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      comment: {
        ...comment,
        reply_count: 0,
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
