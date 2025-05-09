import { NextResponse } from "next/server";
import { getUserFromSession } from "@/utils/auth-utils";
import { handleCommentVote } from "@/lib/db/comments/comments";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const commentId = id;

  const user = await getUserFromSession();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { vote_type } = await request.json();

    // Validate vote type
    if (![1, -1, 0].includes(vote_type)) {
      return NextResponse.json({ error: "Invalid vote type" }, { status: 400 });
    }

    const result = await handleCommentVote(commentId, user.id, vote_type);

    if (!result) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      vote_type: vote_type,
      ...result,
    });
  } catch (error) {
    console.error("Error voting on comment:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
