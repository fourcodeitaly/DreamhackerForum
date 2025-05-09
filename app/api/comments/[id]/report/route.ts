import { NextResponse } from "next/server";
import { getUserFromSession } from "@/lib/auth-utils";
import { query, queryOne } from "@/lib/db/postgres";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const commentId = id;

  const user = await getUserFromSession();
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json(
        { error: "Reason is required" },
        { status: 400 }
      );
    }

    // Check if comment exists
    const comment = await queryOne("SELECT id FROM comments WHERE id = $1", [
      commentId,
    ]);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if user already reported this comment
    const existingReport = await queryOne(
      "SELECT id FROM comment_reports WHERE comment_id = $1 AND user_id = $2",
      [commentId, user.id]
    );

    if (existingReport) {
      return NextResponse.json(
        { error: "You have already reported this comment" },
        { status: 400 }
      );
    }

    // Create report
    await query(
      "INSERT INTO comment_reports (comment_id, user_id, reason) VALUES ($1, $2, $3)",
      [commentId, user.id, reason]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reporting comment:", error);
    return NextResponse.json(
      { error: "Failed to report comment" },
      { status: 500 }
    );
  }
}
