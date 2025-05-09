import { queryOne, query } from "../postgres";
import { User } from "../users";

interface UserStats {
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
}

export async function getUserById(id: string): Promise<User | null> {
  return queryOne<User>(
    `SELECT 
      id,
      email,
      full_name as "fullName",
      username,
      avatar_url as "avatarUrl",
      role,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM users 
    WHERE id = $1`,
    [id]
  );
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return queryOne<User>(
    `SELECT 
      id,
      email,
      full_name as "fullName",
      username,
      avatar_url as "avatarUrl",
      role,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM users 
    WHERE email = $1`,
    [email]
  );
}

export async function getUsersByRole(role: string): Promise<User[]> {
  return query<User>(
    `SELECT 
      id,
      email,
      name,
      username,
      image_url,
      role,
      created_at,
      updated_at
    FROM users 
    WHERE role = $1
    ORDER BY created_at DESC`,
    [role]
  );
}

export async function getUserStats(userId: string): Promise<UserStats> {
  try {
    // Get all stats in parallel for better performance
    const [postCount, commentCount, likesCount] = await Promise.all([
      // Get post count
      queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM posts WHERE user_id = $1`,
        [userId]
      ),
      // Get comment count
      queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM comments WHERE user_id = $1`,
        [userId]
      ),
      // Get likes received on posts
      queryOne<{ count: number }>(
        `SELECT COUNT(*) as count 
           FROM post_likes pl
           INNER JOIN posts p ON pl.post_id = p.id
           WHERE p.user_id = $1`,
        [userId]
      ),
    ]);

    return {
      postsCount: postCount?.count || 0,
      commentsCount: commentCount?.count || 0,
      likesReceived: likesCount?.count || 0,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      postsCount: 0,
      commentsCount: 0,
      likesReceived: 0,
    };
  }
}
