import { query } from "./postgres";

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  content: string;
  link: string | null;
  sender_id: string | null;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender_name?: string;
  sender_username?: string;
  sender_image?: string;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getNotifications(
  userId: string,
  options: {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean;
  } = {}
): Promise<PaginatedNotifications> {
  const page = options.page || 1;
  const limit = options.limit || 20;
  const offset = (page - 1) * limit;

  let sql = `
    SELECT n.*, u.name as sender_name, u.username as sender_username, u.image_url as sender_image
    FROM notifications n
    LEFT JOIN users u ON n.sender_id = u.id
    WHERE n.user_id = $1
  `;
  const params: any[] = [userId];

  if (options.type) {
    sql += ` AND n.type = $${params.length + 1}`;
    params.push(options.type);
  }

  sql += ` ORDER BY n.created_at DESC LIMIT $${params.length + 1} OFFSET $${
    params.length + 2
  }`;
  params.push(limit, offset);

  const notifications = await query<Notification>(sql, params);

  // Get total count for pagination
  const countSql = `
    SELECT COUNT(*) as total
    FROM notifications
    WHERE user_id = $1
    ${options.type ? ` AND type = $2` : ""}
    ${
      options.isRead !== undefined
        ? ` AND is_read = $${options.type ? "3" : "2"}`
        : ""
    }
  `;
  const countParams = [userId];
  if (options.type) countParams.push(options.type);
  if (options.isRead !== undefined)
    countParams.push(options.isRead ? "true" : "false");
  const [{ total }] = await query<{ total: string }>(countSql, countParams);

  return {
    notifications,
    pagination: {
      total: parseInt(total),
      page,
      limit,
      totalPages: Math.ceil(parseInt(total) / limit),
    },
  };
}

export async function createNotification(data: {
  user_id: string;
  type: string;
  content: string;
  link?: string;
  sender_id?: string;
}): Promise<Notification> {
  const sql = `
    INSERT INTO notifications (user_id, type, content, link, sender_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const params = [
    data.user_id,
    data.type,
    data.content,
    data.link || null,
    data.sender_id || null,
  ];
  const [notification] = await query<Notification>(sql, params);
  return notification;
}

export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<Notification | null> {
  const sql = `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const [notification] = await query<Notification>(sql, [
    notificationId,
    userId,
  ]);
  return notification || null;
}

export async function deleteNotification(
  notificationId: string,
  userId: string
): Promise<boolean> {
  const sql = `
    DELETE FROM notifications
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;
  const [notification] = await query<Notification>(sql, [
    notificationId,
    userId,
  ]);
  return !!notification;
}

export async function markAllNotificationsAsRead(
  userId: string
): Promise<number> {
  const sql = `
    UPDATE notifications
    SET is_read = TRUE
    WHERE user_id = $1 AND is_read = FALSE
    RETURNING *
  `;
  const notifications = await query<Notification>(sql, [userId]);
  return notifications.length;
}

export async function notifyFollowersNewPost(
  postId: string,
  userId: string,
  postTitle: string
): Promise<void> {
  // Get all followers of the post creator
  const followersSql = `
    SELECT follower_id 
    FROM user_follows 
    WHERE following_id = $1
  `;
  const followers = await query<{ follower_id: string }>(followersSql, [
    userId,
  ]);

  // Create notifications for each follower
  const notifications = followers.map((follower) => ({
    user_id: follower.follower_id,
    sender_id: userId,
    type: "new_post",
    content: postTitle,
    link: `/posts/${postId}`,
  }));

  // Insert all notifications in a single transaction
  await query(
    `
    INSERT INTO notifications (user_id, sender_id, type, content, link)
    SELECT * FROM UNNEST (
      $1::uuid[],
      $2::uuid[],
      $3::varchar[],
      $4::text[],
      $5::text[]
    )
    RETURNING *
    `,
    [
      notifications.map((n) => n.user_id),
      notifications.map((n) => n.sender_id),
      notifications.map((n) => n.type),
      notifications.map((n) => n.content),
      notifications.map((n) => n.link),
    ]
  );
}
