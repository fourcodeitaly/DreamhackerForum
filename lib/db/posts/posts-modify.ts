"use server";

import { createActivity } from "../activities/activities-modify";
import { Event } from "../events/event-modify";
import { query, queryOne, transaction } from "../postgres";

export type MultilingualContent = {
  en: string;
  zh?: string;
  vi?: string;
};

export type Post = {
  id: string;
  title: MultilingualContent;
  content: MultilingualContent;
  excerpt?: MultilingualContent;
  user_id: string;
  category_id?: string | null;
  image_url?: string | null;
  event_id?: string | null;
  is_pinned?: boolean;
  created_at?: string;
  updated_at?: string;
  tags?: { name: string; id: string }[];
  images?: { id: string; image_url: string; display_order: number }[];
  author?: {
    id: string;
    name: string;
    username: string;
    image_url?: string;
  };
  category?: {
    id: string;
    name: MultilingualContent;
  };
  likes_count: number;
  comments_count?: number;
  liked?: boolean;
  saved?: boolean;
  is_featured?: boolean;
  view_count?: number;
  user?: {
    id: string;
    name: string;
    username: string;
    image_url?: string;
  };
  event?: Event;
  saved_count?: number;
};

// Type definitions
export type PostType = {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  username: string;
  category_id: number;
  category_name: string;
  likes: number;
  views: number;
  tags: string[];
  language: string;
  translations?: Record<string, { title: string; content: string }>;
};

export async function createPost(postData: {
  user_id: string;
  title: MultilingualContent;
  content: MultilingualContent;
  category_id?: string;
  tags?: string[];
  image_url?: string;
  event_id?: string | null;
  is_pinned?: boolean;
}): Promise<Post | null> {
  try {
    return await transaction(async (client) => {
      const now = new Date().toISOString();

      const sql = `
      INSERT INTO posts (
        user_id, title, content, category_id,
        image_url, event_id, is_pinned, created_at, updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

      const values = [
        postData.user_id,
        JSON.stringify(postData.title),
        JSON.stringify(postData.content),
        postData.category_id || null,
        postData.image_url || null,
        postData.event_id || null,
        postData.is_pinned || false,
        now,
        now,
      ];

      const post = await queryOne<Post>(sql, values);

      const categoryName = await queryOne<{ name: string }>(
        "SELECT name FROM categories WHERE id = $1",
        [postData.category_id]
      );

      if (post) {
        if (postData.tags) {
          await createPostTag(post.id, postData.tags);
        }

        await createActivity(
          postData.user_id,
          "post_created",
          post.id,
          "post",
          postData.category_id,
          {
            content: `New post created in ${categoryName?.name}`,
          }
        );
      }

      return post;
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return null;
  }
}

export async function createPostTag(postId: string, tagIds: string[]) {
  try {
    for (const tagId of tagIds) {
      const sql = `
        INSERT INTO post_tags (post_id, tag_id)
        VALUES ($1, $2)
      `;
      await queryOne(sql, [postId, tagId]);
    }
  } catch (error) {
    console.error("Error creating post tag:", error);
    return false;
  }
}

export async function deletePostTag(postId: string, tagIds: string[]) {
  try {
    for (const tagId of tagIds) {
      const sql = `
        DELETE FROM post_tags WHERE post_id = $1 AND tag_id = $2
      `;
      await queryOne(sql, [postId, tagId]);
    }
  } catch (error) {
    console.error("Error deleting post tag:", error);
    return false;
  }
}

export async function updatePost(
  postId: string,
  postData: {
    title?: MultilingualContent;
    content?: MultilingualContent;
    category_id?: string;
    tags?: string[];
    image_url?: string;
    event_id?: string | null;
    is_pinned?: boolean;
  }
): Promise<Post | null> {
  try {
    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Add each field to the update query if it exists
    if (postData.title) {
      updates.push(`title = $${paramIndex}`);
      values.push(JSON.stringify(postData.title));
      paramIndex++;
    }

    if (postData.content) {
      updates.push(`content = $${paramIndex}`);
      values.push(JSON.stringify(postData.content));
      paramIndex++;
    }

    if (postData.category_id !== undefined) {
      updates.push(`category_id = $${paramIndex}`);
      values.push(postData.category_id);
      paramIndex++;
    }

    if (postData.image_url !== undefined) {
      updates.push(`image_url = $${paramIndex}`);
      values.push(postData.image_url);
      paramIndex++;
    }

    if (postData.event_id !== undefined) {
      updates.push(`event_id = $${paramIndex}`);
      values.push(postData.event_id);
      paramIndex++;
    }

    if (postData.is_pinned !== undefined) {
      updates.push(`is_pinned = $${paramIndex}`);
      values.push(postData.is_pinned);
      paramIndex++;
    }

    // Add updated_at timestamp
    updates.push(`updated_at = $${paramIndex}`);
    values.push(new Date().toISOString());
    paramIndex++;

    // Add the post ID as the last parameter
    values.push(postId);

    // Construct the final query
    const sql = `
      UPDATE posts 
      SET ${updates.join(", ")} 
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const post = await queryOne<Post>(sql, values);

    const oldTags = await query<{ tag_id: string }>(
      "SELECT tag_id FROM post_tags WHERE post_id = $1",
      [postId]
    );

    if (oldTags) {
      await deletePostTag(
        postId,
        oldTags.map((tag) => tag.tag_id)
      );
    }

    if (postData.tags) {
      await createPostTag(postId, postData.tags);
    }

    return post;
  } catch (error) {
    console.error("Error updating post:", error);
    return null;
  }
}

export async function deletePost(postId: string): Promise<boolean> {
  try {
    // Use a transaction to delete the post and related data
    return await transaction(async (client) => {
      // Delete comments first (due to foreign key constraints)
      await client.query("DELETE FROM comments WHERE post_id = $1", [postId]);

      // Delete post likes
      await client.query("DELETE FROM post_likes WHERE post_id = $1", [postId]);

      // Delete saved posts
      await client.query("DELETE FROM saved_posts WHERE post_id = $1", [
        postId,
      ]);

      // // Delete post tags
      // await client.query("DELETE FROM post_tags WHERE post_id = $1", [postId]);

      // Finally delete the post
      const result = await client.query("DELETE FROM posts WHERE id = $1", [
        postId,
      ]);

      if (result.rowCount) {
        return true;
      }

      return false;
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return false;
  }
}

export async function addSavedPost(
  userId: string,
  postId: string
): Promise<boolean> {
  try {
    const sql = `
      INSERT INTO saved_posts (user_id, post_id, created_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, post_id) DO NOTHING
      RETURNING *
    `;
    const result = await queryOne(sql, [
      userId,
      postId,
      new Date().toISOString(),
    ]);
    return !!result;
  } catch (error) {
    console.error("Error adding saved post:", error);
    return false;
  }
}

export async function removeSavedPost(
  userId: string,
  postId: string
): Promise<boolean> {
  try {
    const sql = `
      DELETE FROM saved_posts 
      WHERE user_id = $1 AND post_id = $2
      RETURNING *
    `;
    const result = await queryOne(sql, [userId, postId]);
    return !!result;
  } catch (error) {
    console.error("Error removing saved post:", error);
    return false;
  }
}
