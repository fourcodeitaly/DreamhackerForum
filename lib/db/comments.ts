import { NextResponse } from "next/server"
import { query, queryOne, transaction } from "../db/postgres"
import type { User } from "./users"
import type { Comment, CommentSortType, CommentVoteType } from "@/lib/types/comment"

export const commentSort = async (
  comments: Comment[],
  postId: string,
  user?: User,
  parentId?: string | null,
  sort: CommentSortType = "top",
  page = 1,
  limit = 10,
) => {
  // Filter by parent_id for nested comments
  let filteredComments = comments
  if (parentId) {
    filteredComments = comments.filter((comment) => comment.parent_id === parentId)
  } else {
    filteredComments = comments.filter((comment) => !comment.parent_id)
  }

  // Apply sorting
  switch (sort) {
    case "new":
      filteredComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break
    case "old":
      filteredComments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      break
    case "top":
    default:
      filteredComments.sort((a, b) => (b.vote_score || 0) - (a.vote_score || 0))
      break
  }

  // Apply pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedComments = filteredComments.slice(startIndex, endIndex)

  // Calculate reply counts
  const replyCounts = comments.reduce(
    (acc, comment) => {
      if (comment.parent_id) {
        acc[comment.parent_id] = (acc[comment.parent_id] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  // Process comments
  const processedComments = paginatedComments.map((comment) => ({
    ...comment,
    reply_count: replyCounts[comment.id] || 0,
  }))

  return {
    comments: processedComments,
    pagination: {
      page,
      limit,
      hasMore: filteredComments.length > endIndex,
    },
  }
}

export async function getCommentsByPostId(postId: string, userId?: string): Promise<Comment[]> {
  try {
    // Get comments with author information and vote data
    const sql = `
      SELECT 
        c.*,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'image_url', u.image_url
        ) as author,
        COALESCE(c.upvotes, 0) - COALESCE(c.downvotes, 0) as vote_score,
        CASE 
          WHEN cv.vote_type IS NOT NULL THEN cv.vote_type
          ELSE 0
        END as user_vote
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN comment_votes cv ON c.id = cv.comment_id AND cv.user_id = $2
      WHERE c.post_id = $1
      AND (c.status IS NULL OR c.status != 'deleted')
      ORDER BY c.created_at DESC
    `

    const comments = await query<Comment>(sql, [postId, userId || null])

    return comments
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

export async function createComment(
  commentData: Omit<Comment, "id" | "created_at" | "updated_at">,
): Promise<Comment | null> {
  try {
    const now = new Date().toISOString()

    const sql = `
      INSERT INTO comments (
        post_id, user_id, parent_id, content, created_at, updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `

    const values = [
      commentData.post_id,
      commentData.user_id,
      commentData.parent_id || null,
      commentData.content,
      now,
      now,
    ]

    const comment = await queryOne<Comment>(sql, values)

    if (!comment) return null

    // Get author information
    const authorSql = `
      SELECT id, name, username, image_url
      FROM users
      WHERE id = $1
    `
    const author = await queryOne<User>(authorSql, [comment.user_id])

    return {
      ...comment,
      author: author || undefined,
    }
  } catch (error) {
    console.error("Error creating comment:", error)
    return null
  }
}

export async function getCommentById(commentId: string, userId?: string): Promise<Comment | null> {
  try {
    // Get the comment with user information
    const sql = `
      SELECT 
        c.*,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'image_url', u.image_url,
          'role', u.role
        ) as author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `
    const comment = await queryOne<Comment>(sql, [commentId])

    if (!comment) {
      return null
    }

    // Get vote score
    const voteScore = (comment.upvotes || 0) - (comment.downvotes || 0)

    // Get user vote if logged in
    let userVote: CommentVoteType = 0
    if (userId) {
      const voteSql = `
        SELECT vote_type
        FROM comment_votes
        WHERE comment_id = $1 AND user_id = $2
      `
      const vote = await queryOne<{ vote_type: CommentVoteType }>(voteSql, [commentId, userId])
      userVote = vote?.vote_type || 0
    }

    return {
      ...comment,
      vote_score: voteScore,
      user_vote: userVote,
    }
  } catch (error) {
    console.error("Error fetching comment:", error)
    return null
  }
}

export async function updateComment(
  commentId: string,
  userId: string,
  userRole: string,
  updates: { content: string; is_markdown?: boolean },
): Promise<Comment | null> {
  try {
    // Get the comment to check ownership
    const checkSql = `
      SELECT user_id 
      FROM comments 
      WHERE id = $1
    `
    const comment = await queryOne<{ user_id: string }>(checkSql, [commentId])

    if (!comment) {
      return null
    }

    // Check if user owns the comment or is admin
    if (comment.user_id !== userId && userRole !== "admin") {
      throw new Error("Not authorized to edit this comment")
    }

    // Update the comment
    const updateSql = `
      UPDATE comments
      SET 
        content = $1,
        is_markdown = COALESCE($2, true),
        is_edited = true,
        edited_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING 
        *,
        (SELECT json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'image_url', u.image_url,
          'role', u.role
        )
        FROM users u
        WHERE u.id = comments.user_id) as author
    `
    const updatedComment = await queryOne<Comment>(updateSql, [updates.content, updates.is_markdown, commentId])

    if (!updatedComment) {
      return null
    }

    // Get vote score
    const voteScore = (updatedComment.upvotes || 0) - (updatedComment.downvotes || 0)

    // Get user vote
    const voteSql = `
      SELECT vote_type
      FROM comment_votes
      WHERE comment_id = $1 AND user_id = $2
    `
    const vote = await queryOne<{ vote_type: CommentVoteType }>(voteSql, [commentId, userId])

    return {
      ...updatedComment,
      vote_score: voteScore,
      user_vote: vote?.vote_type || 0,
    }
  } catch (error) {
    console.error("Error updating comment:", error)
    throw error
  }
}

export async function deleteComment(commentId: string, userId: string, userRole: string): Promise<boolean> {
  try {
    // Get the comment to check ownership
    const checkSql = `
      SELECT user_id 
      FROM comments 
      WHERE id = $1
    `
    const comment = await queryOne<{ user_id: string }>(checkSql, [commentId])

    if (!comment) {
      return false
    }

    // Check if user owns the comment or is admin
    if (comment.user_id !== userId && userRole !== "admin") {
      throw new Error("Not authorized to delete this comment")
    }

    // Instead of actually deleting, mark as deleted
    const updateSql = `
      UPDATE comments
      SET 
        content = '[deleted]',
        status = 'deleted',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `
    await query(updateSql, [commentId])

    return true
  } catch (error) {
    console.error("Error deleting comment:", error)
    throw error
  }
}

export async function handleCommentVote(
  commentId: string,
  userId: string,
  voteType: number,
): Promise<{ upvotes: number; downvotes: number; vote_score: number } | null> {
  try {
    return await transaction(async (client) => {
      // Get current vote if exists
      const currentVote = await client.query(
        "SELECT vote_type FROM comment_votes WHERE comment_id = $1 AND user_id = $2",
        [commentId, userId],
      )

      const currentVoteType = currentVote.rows[0]?.vote_type || 0

      // Remove old vote if exists
      if (currentVoteType !== 0) {
        await client.query(
          `UPDATE comments 
           SET 
             upvotes = upvotes - CASE WHEN $1 = 1 THEN 1 ELSE 0 END,
             downvotes = downvotes - CASE WHEN $1 = -1 THEN 1 ELSE 0 END,
             updated_at = CURRENT_TIMESTAMP
           WHERE id = $2
           RETURNING *`,
          [currentVoteType, commentId],
        )
      }

      // Add new vote
      if (voteType !== 0) {
        await client.query(
          `UPDATE comments 
           SET 
             upvotes = upvotes + CASE WHEN $1 = 1 THEN 1 ELSE 0 END,
             downvotes = downvotes + CASE WHEN $1 = -1 THEN 1 ELSE 0 END,
             updated_at = CURRENT_TIMESTAMP
           WHERE id = $2
           RETURNING *`,
          [voteType, commentId],
        )
      }

      // Update or insert vote record
      await client.query(
        `INSERT INTO comment_votes (user_id, comment_id, vote_type)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, comment_id) 
         DO UPDATE SET vote_type = $3`,
        [userId, commentId, voteType],
      )

      // Get final updated comment stats
      const updatedComment = await client.query("SELECT upvotes, downvotes FROM comments WHERE id = $1", [commentId])

      if (!updatedComment.rows[0]) {
        return null
      }

      const { upvotes, downvotes } = updatedComment.rows[0]
      return {
        upvotes: Number(upvotes),
        downvotes: Number(downvotes),
        vote_score: Number(upvotes) - Number(downvotes),
      }
    })
  } catch (error) {
    console.error("Error handling comment vote:", error)
    throw error
  }
}

export const commentReport = async (commentId: string, userId: string, reason: string) => {
  try {
    if (!reason) {
      return NextResponse.json({ error: "Reason is required" }, { status: 400 })
    }

    // Check if comment exists
    const comment = await queryOne("SELECT id FROM comments WHERE id = $1", [commentId])

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user already reported this comment
    const existingReport = await queryOne("SELECT id FROM comment_reports WHERE comment_id = $1 AND user_id = $2", [
      commentId,
      userId,
    ])

    if (existingReport) {
      return NextResponse.json({ error: "You have already reported this comment" }, { status: 400 })
    }

    // Create report
    await query("INSERT INTO comment_reports (comment_id, user_id, reason) VALUES ($1, $2, $3)", [
      commentId,
      userId,
      reason,
    ])

    return true
  } catch (error) {
    console.error("Error reporting comment:", error)
    return false
  }
}
