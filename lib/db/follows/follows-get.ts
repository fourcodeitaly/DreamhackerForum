import { query, queryOne } from "../postgres";

export async function getUserFollowStatus(
  followerId: string,
  followingId: string
): Promise<boolean> {
  try {
    const result = await queryOne<{ exists: boolean }>(
      "SELECT EXISTS(SELECT 1 FROM user_follows WHERE follower_id = $1 AND following_id = $2) as exists",
      [followerId, followingId]
    );
    return result?.exists || false;
  } catch (error) {
    console.error("Error getting user follow status:", error);
    return false;
  }
}

export async function getCategoryFollowStatus(
  userId: string,
  categoryId: string
): Promise<boolean> {
  try {
    const result = await queryOne<{ exists: boolean }>(
      "SELECT EXISTS(SELECT 1 FROM category_follows WHERE user_id = $1 AND category_id = $2) as exists",
      [userId, categoryId]
    );
    return result?.exists || false;
  } catch (error) {
    console.error("Error getting category follow status:", error);
    return false;
  }
}

export async function getUserFollowers(
  userId: string
): Promise<
  Array<{ id: string; name: string; username: string; image_url?: string }>
> {
  try {
    return await query(
      `SELECT u.id, u.name, u.username, u.image_url
       FROM users u
       JOIN user_follows uf ON u.id = uf.follower_id
       WHERE uf.following_id = $1
       ORDER BY uf.created_at DESC`,
      [userId]
    );
  } catch (error) {
    console.error("Error getting user followers:", error);
    return [];
  }
}

export async function getUserFollowing(
  userId: string
): Promise<
  Array<{ id: string; name: string; username: string; image_url?: string }>
> {
  try {
    return await query(
      `SELECT u.id, u.name, u.username, u.image_url
       FROM users u
       JOIN user_follows uf ON u.id = uf.following_id
       WHERE uf.follower_id = $1
       ORDER BY uf.created_at DESC`,
      [userId]
    );
  } catch (error) {
    console.error("Error getting user following:", error);
    return [];
  }
}

export async function getUserFollowedCategories(
  userId: string
): Promise<Array<{ id: string; name: any }>> {
  try {
    return await query(
      `SELECT c.id, c.name
       FROM categories c
       JOIN category_follows cf ON c.id = cf.category_id
       WHERE cf.user_id = $1
       ORDER BY cf.created_at DESC`,
      [userId]
    );
  } catch (error) {
    console.error("Error getting user followed categories:", error);
    return [];
  }
}

export async function getCategoryFollowers(
  categoryId: string
): Promise<
  Array<{ id: string; name: string; username: string; image_url?: string }>
> {
  try {
    return await query(
      `SELECT u.id, u.name, u.username, u.image_url
       FROM users u
       JOIN category_follows cf ON u.id = cf.user_id
       WHERE cf.category_id = $1
       ORDER BY cf.created_at DESC`,
      [categoryId]
    );
  } catch (error) {
    console.error("Error getting category followers:", error);
    return [];
  }
}
