import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserFromSession } from "@/lib/auth-utils";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const commentId = params.id;

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database connection failed" },
      { status: 500 }
    );
  }

  const user = await getUserFromSession(supabase);
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

    // Check if comment exists
    const { data: comment } = await supabase
      .from("comments")
      .select("id, upvotes, downvotes")
      .eq("id", commentId)
      .single();

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Get current vote if exists
    const { data: currentVote } = await supabase
      .from("comment_votes")
      .select("vote_type")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .single();

    // Start a transaction
    const { error } = await supabase.rpc("handle_comment_vote", {
      p_user_id: user.id,
      p_comment_id: commentId,
      p_vote_type: vote_type,
      p_current_vote_type: currentVote?.vote_type || 0,
    });

    if (error) {
      throw error;
    }

    // Get updated comment
    const { data: updatedComment } = await supabase
      .from("comments")
      .select("upvotes, downvotes")
      .eq("id", commentId)
      .single();

    return NextResponse.json({
      success: true,
      vote_type: vote_type,
      upvotes: updatedComment.upvotes,
      downvotes: updatedComment.downvotes,
      vote_score: updatedComment.upvotes - updatedComment.downvotes,
    });
  } catch (error) {
    console.error("Error voting on comment:", error);
    return NextResponse.json(
      { error: "Failed to process vote" },
      { status: 500 }
    );
  }
}
