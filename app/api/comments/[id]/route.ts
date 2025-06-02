import { NextResponse } from "next/server";
import {
  getCommentById,
  updateComment,
  deleteComment,
} from "@/lib/db/comments/comments";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { requestErrorHandler } from "@/handler/error-handler";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/handler/error";

// Get a single comment with its replies
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return requestErrorHandler(async () => {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    const comment = await getCommentById(id, user?.id);

    if (!comment) {
      throw new NotFoundError();
    }

    return { comment };
  });
}

// Update a comment
export async function PATCH(
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

    const { content, is_markdown } = await request.json();

    if (!content) {
      throw new BadRequestError();
    }

    const updatedComment = await updateComment(id, user.id, user.role, {
      content,
      is_markdown,
    });

    if (!updatedComment) {
      throw new NotFoundError();
    }

    return { comment: updatedComment };
  });
}

// Delete a comment
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

    const success = await deleteComment(id, user.id, user.role);

    if (!success) {
      throw new NotFoundError();
    }

    return { success: true };
  });
}
