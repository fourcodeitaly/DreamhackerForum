import { transaction } from "../postgres";

export async function handlePostLike(
  postId: string,
  userId: string
): Promise<{ liked: boolean } | null> {
  try {
    return await transaction(async (client) => {
      // Check if user has already liked the post
      const existingLike = await client.query(
        "SELECT 1 FROM post_likes WHERE post_id = $1 AND user_id = $2",
        [postId, userId]
      );

      if (existingLike.rows.length > 0) {
        // Unlike the post
        await client.query(
          "DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2",
          [postId, userId]
        );

        await client.query(
          "UPDATE posts SET likes_count = likes_count - 1 WHERE id = $1",
          [postId]
        );
      } else {
        // Like the post
        await client.query(
          "INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)",
          [postId, userId]
        );

        await client.query(
          "UPDATE posts SET likes_count = likes_count + 1 WHERE id = $1",
          [postId]
        );
      }

      return {
        liked: existingLike.rows.length === 0,
      };
    });
  } catch (error) {
    console.error("Error handling post like:", error);
    throw error;
  }
}
