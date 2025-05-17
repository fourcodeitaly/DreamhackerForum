"use server";

import { query } from "../postgres";

export type ActivityType =
  | "post_created"
  | "post_updated"
  | "post_deleted"
  | "comment_created";

export interface Activity {
  id: string;
  user_id: string;
  type: ActivityType;
  target_id: string; // post_id or comment_id
  target_type: "post" | "comment";
  category_id?: string;
  created_at: Date;
  metadata?: Record<string, any>;
}

export async function createActivity(
  userId: string,
  type: ActivityType,
  targetId: string,
  targetType: "post" | "comment",
  categoryId?: string,
  metadata?: Record<string, any>
): Promise<Activity> {
  const sql = `
    INSERT INTO activities (
      user_id,
      type,
      target_id,
      target_type,
      category_id,
      metadata
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const result = await query<Activity>(sql, [
    userId,
    type,
    targetId,
    targetType,
    categoryId,
    metadata ? JSON.stringify(metadata) : null,
  ]);

  return result[0];
}

export async function getRecentActivities(
  limit: number = 10,
  offset: number = 0
): Promise<Activity[]> {
  const sql = `
    SELECT 
      a.*,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'username', u.username,
        'image_url', u.image_url
      ) as user,
      CASE 
        WHEN a.target_type = 'post' THEN json_build_object(
          'id', p.id,
          'title', p.title
        )
        WHEN a.target_type = 'comment' THEN json_build_object(
          'id', c.id,
          'content', c.content
        )
      END as target,
      CASE 
        WHEN a.category_id IS NOT NULL THEN json_build_object(
          'id', cat.id,
          'name', cat.name
        )
      END as category
    FROM activities a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN posts p ON a.target_type = 'post' AND a.target_id = p.id
    LEFT JOIN comments c ON a.target_type = 'comment' AND a.target_id = c.id
    LEFT JOIN categories cat ON a.category_id = cat.id
    ORDER BY a.created_at DESC
    LIMIT $1 OFFSET $2
  `;

  return await query<Activity>(sql, [limit, offset]);
}

export async function getActivitiesByUser(
  userId: string,
  limit: number = 10,
  offset: number = 0
): Promise<Activity[]> {
  const sql = `
    SELECT 
      a.*,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'username', u.username,
        'image_url', u.image_url
      ) as user,
      CASE 
        WHEN a.target_type = 'post' THEN json_build_object(
          'id', p.id,
          'title', p.title
        )
        WHEN a.target_type = 'comment' THEN json_build_object(
          'id', c.id,
          'content', c.content
        )
      END as target,
      CASE 
        WHEN a.category_id IS NOT NULL THEN json_build_object(
          'id', cat.id,
          'name', cat.name
        )
      END as category
    FROM activities a
    LEFT JOIN users u ON a.user_id = u.id
    LEFT JOIN posts p ON a.target_type = 'post' AND a.target_id = p.id
    LEFT JOIN comments c ON a.target_type = 'comment' AND a.target_id = c.id
    LEFT JOIN categories cat ON a.category_id = cat.id
    WHERE a.user_id = $1
    ORDER BY a.created_at DESC
    LIMIT $2 OFFSET $3
  `;

  return await query<Activity>(sql, [userId, limit, offset]);
}
