import { query, queryOne, transaction } from "../db/postgres";
import type { User } from "./users";

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: User;
  likes_count?: number;
  liked?: boolean;
  vote_score?: number;
  user_vote?: number;
};

export async function getCommentsByPostId(
  postId: string,
  userId?: string
): Promise<Comment[]> {
  try {
    // Get comments with author information
    const sql = `
      SELECT 
        c.*,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'image_url', u.image_url
        ) as author
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at DESC
    `;

    const comments = await query<Comment>(sql, [postId]);

    if (comments.length === 0) {
      return [];
    }

    // Get comment IDs for additional queries
    const commentIds = comments.map((comment) => comment.id);

    // Get likes count for all comments
    const likesSql = `
      SELECT comment_id, COUNT(*) as count
      FROM comment_likes
      WHERE comment_id = ANY($1::uuid[])
      GROUP BY comment_id
    `;
    const likesResults = await query<{ comment_id: string; count: string }>(
      likesSql,
      [commentIds]
    );

    // Create a map of like counts by comment_id
    const likesByCommentId: Record<string, number> = {};
    likesResults.forEach((like) => {
      likesByCommentId[like.comment_id] = Number.parseInt(like.count);
    });

    // If userId is provided, check which comments the user has liked
    let likedCommentIds: string[] = [];
    if (userId) {
      const likedSql = `
        SELECT comment_id
        FROM comment_likes
        WHERE user_id = $1 AND comment_id = ANY($2::uuid[])
      `;
      const likedResults = await query<{ comment_id: string }>(likedSql, [
        userId,
        commentIds,
      ]);
      likedCommentIds = likedResults.map((like) => like.comment_id);
    }

    // Combine all data
    return comments.map((comment) => ({
      ...comment,
      likes_count: likesByCommentId[comment.id] || 0,
      liked: likedCommentIds.includes(comment.id),
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

export async function createComment(
  commentData: Omit<Comment, "id" | "created_at" | "updated_at">
): Promise<Comment | null> {
  try {
    const now = new Date().toISOString();

    const sql = `
      INSERT INTO comments (
        post_id, user_id, parent_id, content, created_at, updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const values = [
      commentData.post_id,
      commentData.user_id,
      commentData.parent_id || null,
      commentData.content,
      now,
      now,
    ];

    const comment = await queryOne<Comment>(sql, values);

    if (!comment) return null;

    // Get author information
    const authorSql = `
      SELECT id, name, username, image_url
      FROM users
      WHERE id = $1
    `;
    const author = await queryOne<User>(authorSql, [comment.user_id]);

    return {
      ...comment,
      author: author || undefined,
      likes_count: 0,
      liked: false,
    };
  } catch (error) {
    console.error("Error creating comment:", error);
    return null;
  }
}

export async function getCommentById(
  commentId: string,
  userId?: string
): Promise<Comment | null> {
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
    `;
    const comment = await queryOne<Comment>(sql, [commentId]);

    if (!comment) {
      return null;
    }

    // Get vote score
    const voteScore = (comment.upvotes || 0) - (comment.downvotes || 0);

    // Get user vote if logged in
    let userVote = 0;
    if (userId) {
      const voteSql = `
        SELECT vote_type
        FROM comment_votes
        WHERE comment_id = $1 AND user_id = $2
      `;
      const vote = await queryOne<{ vote_type: number }>(voteSql, [
        commentId,
        userId,
      ]);
      userVote = vote?.vote_type || 0;
    }

    return {
      ...comment,
      vote_score: voteScore,
      user_vote: userVote,
    };
  } catch (error) {
    console.error("Error fetching comment:", error);
    return null;
  }
}

export async function updateComment(
  commentId: string,
  userId: string,
  userRole: string,
  updates: { content: string; is_markdown?: boolean }
): Promise<Comment | null> {
  try {
    // Get the comment to check ownership
    const checkSql = `
      SELECT user_id 
      FROM comments 
      WHERE id = $1
    `;
    const comment = await queryOne<{ user_id: string }>(checkSql, [commentId]);

    if (!comment) {
      return null;
    }

    // Check if user owns the comment or is admin
    if (comment.user_id !== userId && userRole !== "admin") {
      throw new Error("Not authorized to edit this comment");
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
    `;
    const updatedComment = await queryOne<Comment>(updateSql, [
      updates.content,
      updates.is_markdown,
      commentId,
    ]);

    if (!updatedComment) {
      return null;
    }

    // Get vote score
    const voteScore =
      (updatedComment.upvotes || 0) - (updatedComment.downvotes || 0);

    // Get user vote
    const voteSql = `
      SELECT vote_type
      FROM comment_votes
      WHERE comment_id = $1 AND user_id = $2
    `;
    const vote = await queryOne<{ vote_type: number }>(voteSql, [
      commentId,
      userId,
    ]);

    return {
      ...updatedComment,
      vote_score: voteScore,
      user_vote: vote?.vote_type || 0,
    };
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
}

export async function deleteComment(
  commentId: string,
  userId: string,
  userRole: string
): Promise<boolean> {
  try {
    // Get the comment to check ownership
    const checkSql = `
      SELECT user_id 
      FROM comments 
      WHERE id = $1
    `;
    const comment = await queryOne<{ user_id: string }>(checkSql, [commentId]);

    if (!comment) {
      return false;
    }

    // Check if user owns the comment or is admin
    if (comment.user_id !== userId && userRole !== "admin") {
      throw new Error("Not authorized to delete this comment");
    }

    // Instead of actually deleting, mark as deleted
    const updateSql = `
      UPDATE comments
      SET 
        content = '[deleted]',
        status = 'deleted',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
    await query(updateSql, [commentId]);

    return true;
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}
