import { query, queryOne } from "./postgres";

export interface Contributor {
  id: string;
  username: string;
  name: string;
  image_url: string | null;
  post_count: number;
  comment_count: number;
  total_likes: number;
}

export type UserRole = "user" | "admin";

export type User = {
  id: string;
  username: string;
  email: string;
  name: string;
  image_url?: string;
  bio?: string;
  location?: string;
  role?: UserRole;
  joined_at: string;
  updated_at: string;
  followers_count: number;
  following_count: number;
  isFollowed?: boolean;
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
};

interface UserStats {
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
}

export async function getUserByUsername(
  username: string
): Promise<User | null> {
  // If local auth is enabled, use it
  // if (localAuth.isEnabled()) {
  //   const users = localAuth.getAllUsers();
  //   return users.find((u) => u.username === username) || null;
  // }

  try {
    return await queryOne<User>("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}

export async function updateUser(
  id: string,
  userData: Partial<User>
): Promise<User | null> {
  try {
    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Add each field to the update query
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    // Add updated_at timestamp
    updates.push(`updated_at = $${paramIndex}`);
    values.push(new Date().toISOString());
    paramIndex++;

    // Add the user ID as the last parameter
    values.push(id);

    // Construct the final query
    const sql = `
      UPDATE users 
      SET ${updates.join(", ")} 
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    return await queryOne<User>(sql, values);
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  // If local auth is enabled, use it
  // if (localAuth.isEnabled()) {
  //   return localAuth.isUserAdmin(userId);
  // }

  try {
    const user = await getUserById(userId);
    return user?.role === "admin";
  } catch (error) {
    console.error("Error checking if user is admin:", error);
    return false;
  }
}

// New function to set a user as admin
export async function setUserAsAdmin(userId: string): Promise<boolean> {
  try {
    const sql = `
      UPDATE users
      SET role = 'admin', updated_at = $1
      WHERE id = $2
    `;

    await query(sql, [new Date().toISOString(), userId]);
    return true;
  } catch (error) {
    console.error("Error setting user as admin:", error);
    return false;
  }
}

// New function to remove admin role from a user
export async function removeAdminRole(userId: string): Promise<boolean> {
  try {
    const sql = `
      UPDATE users
      SET role = 'user', updated_at = $1
      WHERE id = $2
    `;

    await query(sql, [new Date().toISOString(), userId]);
    return true;
  } catch (error) {
    console.error("Error removing admin role:", error);
    return false;
  }
}

// New function to get all admin users
export async function getAllAdminUsers(): Promise<User[]> {
  try {
    return await query<User>("SELECT * FROM users WHERE role = $1", ["admin"]);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return [];
  }
}

export async function getTopContributors(limit = 3): Promise<Contributor[]> {
  try {
    const sql = `
      WITH user_stats AS (
        SELECT 
          u.id,
          u.username,
          u.name,
          u.image_url,
          COUNT(DISTINCT p.id) as post_count,
          COUNT(DISTINCT c.id) as comment_count,
          (
            COALESCE((
              SELECT COUNT(*)
              FROM post_likes pl
              JOIN posts p2 ON pl.post_id = p2.id
              WHERE p2.user_id = u.id
            ), 0) +
            COALESCE((
              SELECT COUNT(*)
              FROM comment_likes cl
              JOIN comments c2 ON cl.comment_id = c2.id
              WHERE c2.user_id = u.id
            ), 0)
          ) as total_likes
        FROM users u
        LEFT JOIN posts p ON u.id = p.user_id
        LEFT JOIN comments c ON u.id = c.user_id
        GROUP BY u.id, u.username, u.name, u.image_url
      )
      SELECT 
        id,
        username,
        name,
        image_url,
        post_count,
        comment_count,
        total_likes
      FROM user_stats
      ORDER BY (post_count * 2 + comment_count + total_likes) DESC
      LIMIT $1
    `;

    return await query<Contributor>(sql, [limit]);
  } catch (error) {
    console.error("Error fetching top contributors:", error);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | null> {
  return queryOne<User>(
    `SELECT 
      id,
      email,
      name,
      username,
      image_url,
      role,
      joined_at as created_at,
      updated_at
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
      name,
      username,
      image_url,
      role,
      joined_at as created_at,
      updated_at
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
