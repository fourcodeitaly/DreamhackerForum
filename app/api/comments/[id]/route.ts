import { NextResponse } from "next/server";
import {
  getCommentById,
  updateComment,
  deleteComment,
} from "@/lib/db/comments/comments";
import { getServerSession } from "next-auth";

// Get a single comment with its replies
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession();
  const user = session?.user;

  try {
    const comment = await getCommentById(id, user?.id);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ comment });
  } catch (error) {
    console.error("Error fetching comment:", error);
    return NextResponse.json(
      { error: "Failed to fetch comment" },
      { status: 500 }
    );
  }
}

// Update a comment
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { content, is_markdown } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const updatedComment = await updateComment(id, user.id, user.role, {
      content,
      is_markdown,
    });

    if (!updatedComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ comment: updatedComment });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Not authorized to edit this comment"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

// Delete a comment
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const success = await deleteComment(id, user.id, user.role);

    if (!success) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Not authorized to delete this comment"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
