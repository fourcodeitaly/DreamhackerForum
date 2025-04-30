import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { getUserFromSession } from "@/lib/auth-utils"

// Get a single comment with its replies
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const commentId = params.id

  const supabase = createServerSupabaseClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
  }

  try {
    const { data: comment, error } = await supabase
      .from("comments")
      .select(`
        *,
        user:user_id (id, name, username, image_url, role)
      `)
      .eq("id", commentId)
      .single()

    if (error) {
      throw error
    }

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Get vote score
    const voteScore = (comment.upvotes || 0) - (comment.downvotes || 0)

    // Get user vote if logged in
    const user = await getUserFromSession(supabase)
    let userVote = 0

    if (user) {
      const { data: vote } = await supabase
        .from("comment_votes")
        .select("vote_type")
        .eq("comment_id", commentId)
        .eq("user_id", user.id)
        .single()

      userVote = vote?.vote_type || 0
    }

    return NextResponse.json({
      comment: {
        ...comment,
        vote_score: voteScore,
        user_vote: userVote,
      },
    })
  } catch (error) {
    console.error("Error fetching comment:", error)
    return NextResponse.json({ error: "Failed to fetch comment" }, { status: 500 })
  }
}

// Update a comment
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const commentId = params.id

  const supabase = createServerSupabaseClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
  }

  const user = await getUserFromSession(supabase)
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  try {
    // Get the comment to check ownership
    const { data: comment } = await supabase.from("comments").select("user_id").eq("id", commentId).single()

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user owns the comment or is admin
    if (comment.user_id !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized to edit this comment" }, { status: 403 })
    }

    const { content, is_markdown } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Update the comment
    const { data: updatedComment, error } = await supabase
      .from("comments")
      .update({
        content,
        is_markdown: is_markdown !== undefined ? is_markdown : true,
        is_edited: true,
        edited_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId)
      .select(`
        *,
        user:user_id (id, name, username, image_url, role)
      `)
      .single()

    if (error) {
      throw error
    }

    // Get vote score
    const voteScore = (updatedComment.upvotes || 0) - (updatedComment.downvotes || 0)

    // Get user vote
    const { data: vote } = await supabase
      .from("comment_votes")
      .select("vote_type")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .single()

    return NextResponse.json({
      comment: {
        ...updatedComment,
        vote_score: voteScore,
        user_vote: vote?.vote_type || 0,
      },
    })
  } catch (error) {
    console.error("Error updating comment:", error)
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 })
  }
}

// Delete a comment
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const commentId = params.id

  const supabase = createServerSupabaseClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
  }

  const user = await getUserFromSession(supabase)
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  try {
    // Get the comment to check ownership
    const { data: comment } = await supabase.from("comments").select("user_id").eq("id", commentId).single()

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user owns the comment or is admin
    if (comment.user_id !== user.id && user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized to delete this comment" }, { status: 403 })
    }

    // Instead of actually deleting, mark as deleted
    const { error } = await supabase
      .from("comments")
      .update({
        content: "[deleted]",
        status: "deleted",
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
