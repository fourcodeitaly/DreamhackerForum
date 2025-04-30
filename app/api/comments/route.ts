import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getUserFromSession } from "@/lib/auth-utils"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const postId = searchParams.get("post_id")
  const parentId = searchParams.get("parent_id") || null
  const sort = searchParams.get("sort") || "top"
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "50")
  const offset = (page - 1) * limit

  if (!postId) {
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()

  if (!supabase) {
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
  }

  // Get current user for vote status
  const user = await getUserFromSession()

  try {
    // Build query based on sort parameter
    let query = supabase
      .from("comments")
      .select(
        `
        *,
        user:user_id (id, name, username, image_url, role),
        reply_count:comments!parent_id (count)
      `,
      )
      .eq("post_id", postId)
      .eq("status", "active")

    // Filter by parent_id for nested comments
    if (parentId) {
      query = query.eq("parent_id", parentId)
    } else {
      query = query.is("parent_id", null)
    }

    // Apply sorting
    switch (sort) {
      case "new":
        query = query.order("created_at", { ascending: false })
        break
      case "old":
        query = query.order("created_at", { ascending: true })
        break
      case "controversial":
        query = query.order("downvotes", { ascending: false })
        break
      case "top":
      default:
        query = query.order("upvotes", { ascending: false })
        break
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: comments, error } = await query

    if (error) {
      throw error
    }

    // Get user votes if logged in
    let userVotes = {}
    if (user) {
      const { data: votes } = await supabase
        .from("comment_votes")
        .select("comment_id, vote_type")
        .eq("user_id", user.id)
        .in(
          "comment_id",
          comments.map((c) => c.id),
        )

      userVotes = (votes || []).reduce((acc, vote) => {
        acc[vote.comment_id] = vote.vote_type
        return acc
      }, {})
    }

    // Process comments
    const processedComments = comments.map((comment) => {
      const voteScore = (comment.upvotes || 0) - (comment.downvotes || 0)
      return {
        ...comment,
        vote_score: voteScore,
        user_vote: userVotes[comment.id] || 0,
        reply_count: comment.reply_count?.[0]?.count || 0,
      }
    })

    return NextResponse.json({
      comments: processedComments,
      pagination: {
        page,
        limit,
        hasMore: comments.length === limit,
      },
    })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()

  if (!supabase) {
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
  }

  const user = await getUserFromSession()

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  try {
    const { post_id, parent_id, content, is_markdown = true } = await request.json()

    if (!post_id || !content) {
      return NextResponse.json({ error: "Post ID and content are required" }, { status: 400 })
    }

    // Validate parent comment exists if provided
    if (parent_id) {
      const { data: parentComment } = await supabase.from("comments").select("id").eq("id", parent_id).single()

      if (!parentComment) {
        return NextResponse.json({ error: "Parent comment not found" }, { status: 404 })
      }
    }

    // Insert new comment
    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        post_id,
        user_id: user.id,
        parent_id: parent_id || null,
        content,
        is_markdown,
      })
      .select(
        `
        *,
        user:user_id (id, name, username, image_url, role)
      `,
      )
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      comment: {
        ...comment,
        vote_score: 0,
        user_vote: 0,
        replies: [],
        reply_count: 0,
      },
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
