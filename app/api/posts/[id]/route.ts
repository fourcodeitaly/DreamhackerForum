import { NextResponse } from "next/server";
import { getPostById } from "@/lib/db/posts/post-get";
import { addSavedPost, removeSavedPost } from "@/lib/db/posts/posts-modify";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await getPostById(params.id);

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
