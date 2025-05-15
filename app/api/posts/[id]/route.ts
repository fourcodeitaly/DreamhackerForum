import { NextResponse } from "next/server";
import { getPostById } from "@/lib/db/posts/post-get";
import {
  addSavedPost,
  deletePost,
  removeSavedPost,
} from "@/lib/db/posts/posts-modify";
import { queryOne } from "@/lib/db/postgres";
import { getServerUser } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const post = await getPostById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, action } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (action !== "save" && action !== "unsave") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const success =
      action === "save"
        ? await addSavedPost(userId, params.id)
        : await removeSavedPost(userId, params.id);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update saved post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating saved post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get post to check ownership
    const post = await queryOne<{ user_id: string }>(
      "SELECT user_id FROM posts WHERE id = $1",
      [id]
    );

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if user is admin or post owner
    if (user.role !== "admin" && post.user_id !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this post" },
        { status: 403 }
      );
    }

    const success = await deletePost(id);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the post" },
      { status: 500 }
    );
  }
}
