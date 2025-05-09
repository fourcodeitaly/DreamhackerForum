"use server";

import { queryOne, query } from "@/lib/db/postgres";

export async function getDashboardStats() {
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
      success: true,
      data: {
        totalUsers: userCount?.count || 0,
        totalPosts: postCount?.count || 0,
        totalComments: commentCount?.count || 0,
        totalAdmins: adminCount?.count || 0,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard stats",
    };
  }
}

export async function getRecentActivity(limit: number = 10) {
  try {
    const activities = await query(
      `SELECT 
        a.id,
        a.type,
        a.user_id,
        a.content_id,
        a.created_at,
        u.username,
        u.image_url
       FROM activities a
       JOIN users u ON a.user_id = u.id
       ORDER BY a.created_at DESC
       LIMIT $1`,
      [limit]
    );

    return { success: true, data: activities };
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch recent activity",
    };
  }
}

export async function getSystemStatus() {
  try {
    const [userStats, postStats, commentStats] = await Promise.all([
      queryOne(
        `SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as new
         FROM users`
      ),
      queryOne(
        `SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as new
         FROM posts`
      ),
      queryOne(
        `SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN created_at > NOW() - INTERVAL '24 hours' THEN 1 END) as new
         FROM comments`
      ),
    ]);

    return {
      success: true,
      data: {
        users: userStats,
        posts: postStats,
        comments: commentStats,
      },
    };
  } catch (error) {
    console.error("Error fetching system status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch system status",
    };
  }
}
