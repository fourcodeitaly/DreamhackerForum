import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth-utils";
import { getCommentsByPostId, createComment } from "@/lib/db/comments";

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
  const user = await getUserFromSession();

  try {
    // Get comments using the new PostgreSQL function
    const comments = await getCommentsByPostId(postId, user?.id);

    // Filter by parent_id for nested comments
    let filteredComments = comments;
    if (parentId) {
      filteredComments = comments.filter(
        (comment) => comment.parent_id === parentId
      );
    } else {
      filteredComments = comments.filter((comment) => !comment.parent_id);
    }

    // Apply sorting
    switch (sort) {
      case "new":
        filteredComments.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "old":
        filteredComments.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "top":
      default:
        filteredComments.sort(
          (a, b) => (b.likes_count || 0) - (a.likes_count || 0)
        );
        break;
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedComments = filteredComments.slice(startIndex, endIndex);

    // Calculate reply counts
    const replyCounts = comments.reduce((acc, comment) => {
      if (comment.parent_id) {
        acc[comment.parent_id] = (acc[comment.parent_id] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Process comments
    const processedComments = paginatedComments.map((comment) => ({
      ...comment,
      reply_count: replyCounts[comment.id] || 0,
    }));

    return NextResponse.json({
      comments: processedComments,
      pagination: {
        page,
        limit,
        hasMore: filteredComments.length > endIndex,
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
  const user = await getUserFromSession();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { post_id, parent_id, content } = await request.json();

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
