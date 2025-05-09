import { queryOne } from "./postgres";

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalAdmins: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [userCount, postCount, commentCount, adminCount] = await Promise.all([
      queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM users`),
      queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM posts`),
      queryOne<{ count: number }>(`SELECT COUNT(*) as count FROM comments`),
      queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM users WHERE role = 'admin'`
      ),
    ]);

    return {
      totalUsers: userCount?.count || 0,
      totalPosts: postCount?.count || 0,
      totalComments: commentCount?.count || 0,
      totalAdmins: adminCount?.count || 0,
    };
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return {
      totalUsers: 0,
      totalPosts: 0,
      totalComments: 0,
      totalAdmins: 0,
    };
  }
}
