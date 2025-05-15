import { transaction } from "../postgres";

export async function followUser(
  followerId: string,
  followingId: string
): Promise<boolean> {
  try {
    return await transaction(async (client) => {
      // Check if already following
      const existingFollow = await client.query(
        "SELECT 1 FROM user_follows WHERE follower_id = $1 AND following_id = $2",
        [followerId, followingId]
      );

      if (existingFollow.rows.length > 0) {
        return false;
      }

      // Create follow relationship
      await client.query(
        "INSERT INTO user_follows (follower_id, following_id) VALUES ($1, $2)",
        [followerId, followingId]
      );

      // Update follower counts
      await client.query(
        `UPDATE users 
         SET followers_count = followers_count + 1 
         WHERE id = $1`,
        [followingId]
      );

      await client.query(
        `UPDATE users 
         SET following_count = following_count + 1 
         WHERE id = $1`,
        [followerId]
      );

      return true;
    });
  } catch (error) {
    console.error("Error following user:", error);
    return false;
  }
}

export async function unfollowUser(
  followerId: string,
  followingId: string
): Promise<boolean> {
  try {
    return await transaction(async (client) => {
      // Check if following
      const existingFollow = await client.query(
        "SELECT 1 FROM user_follows WHERE follower_id = $1 AND following_id = $2",
        [followerId, followingId]
      );

      if (existingFollow.rows.length === 0) {
        return false;
      }

      // Remove follow relationship
      await client.query(
        "DELETE FROM user_follows WHERE follower_id = $1 AND following_id = $2",
        [followerId, followingId]
      );

      // Update follower counts
      await client.query(
        `UPDATE users 
         SET followers_count = GREATEST(followers_count - 1, 0) 
         WHERE id = $1`,
        [followingId]
      );

      await client.query(
        `UPDATE users 
         SET following_count = GREATEST(following_count - 1, 0) 
         WHERE id = $1`,
        [followerId]
      );

      return true;
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return false;
  }
}

export async function followCategory(
  userId: string,
  categoryId: string
): Promise<boolean> {
  try {
    return await transaction(async (client) => {
      // Check if already following
      const existingFollow = await client.query(
        "SELECT 1 FROM category_follows WHERE user_id = $1 AND category_id = $2",
        [userId, categoryId]
      );

      if (existingFollow.rows.length > 0) {
        return false;
      }

      // Create follow relationship
      await client.query(
        "INSERT INTO category_follows (user_id, category_id) VALUES ($1, $2)",
        [userId, categoryId]
      );

      // Update follower count
      await client.query(
        `UPDATE categories 
         SET followers_count = followers_count + 1 
         WHERE id = $1`,
        [categoryId]
      );

      return true;
    });
  } catch (error) {
    console.error("Error following category:", error);
    return false;
  }
}

export async function unfollowCategory(
  userId: string,
  categoryId: string
): Promise<boolean> {
  try {
    return await transaction(async (client) => {
      // Check if following
      const existingFollow = await client.query(
        "SELECT 1 FROM category_follows WHERE user_id = $1 AND category_id = $2",
        [userId, categoryId]
      );

      if (existingFollow.rows.length === 0) {
        return false;
      }

      // Remove follow relationship
      await client.query(
        "DELETE FROM category_follows WHERE user_id = $1 AND category_id = $2",
        [userId, categoryId]
      );

      // Update follower count
      await client.query(
        `UPDATE categories 
         SET followers_count = GREATEST(followers_count - 1, 0) 
         WHERE id = $1`,
        [categoryId]
      );

      return true;
    });
  } catch (error) {
    console.error("Error unfollowing category:", error);
    return false;
  }
}
