"use server";

import { query, queryOne } from "../postgres";
import type { Post, PostType } from "./posts-modify";

export async function getNullTitlePosts(
  page: number = 1,
  postsPerPage: number = 10
): Promise<{ posts: Post[] | null; total: number }> {
  const offset = (page - 1) * postsPerPage;

  const countSql = `
    SELECT COUNT(*) 
    FROM posts 
    WHERE title->>'en' = ''
    OR title->>'vi' = ''
    OR title->>'zh' = ''
  `;
  const totalResult = await queryOne<{ count: string }>(countSql);
  const total = Number.parseInt(totalResult?.count || "0");

  const sql = `
  SELECT * FROM posts 
  WHERE length(title->>'en') = 0
  OR length(title->>'zh') = 0
  OR length(title->>'vi') = 0
  ORDER BY created_at DESC
  LIMIT $1 OFFSET $2
  `;

  const posts = await query<Post>(sql, [postsPerPage, offset]);

  return { posts, total };
}

export async function getPostById(
  postId: string,
  userId?: string
): Promise<Post | null> {
  try {
    // Get the post with user and category information
    const sql = `
        SELECT 
          p.*,
          json_build_object(
            'id', u.id,
            'name', u.name,
            'username', u.username,
            'image_url', u.image_url
          ) as author,
          json_build_object(
            'id', c.id,
            'name', c.name
          ) as category,
          (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
          (
            SELECT json_agg(
              json_build_object(
                'id', pi.id,
                'image_url', pi.image_url,
                'display_order', pi.display_order
              ) ORDER BY pi.display_order
            )
            FROM post_images pi
            WHERE pi.post_id = p.id
          ) as images
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
      `;

    const post = await queryOne<Post>(sql, [postId]);

    if (!post) return null;

    // Get tags for this post
    const tagsSql = `
      SELECT t.name, t.id
      FROM post_tags pt
      JOIN tags t ON pt.tag_id = t.id
      WHERE pt.post_id = $1
    `;
    const tags = await query<{ name: string; id: string }>(tagsSql, [postId]);

    // // Get like count
    // const likesSql = `SELECT COUNT(*) as count FROM post_likes WHERE post_id = $1`;
    // const likesResult = await queryOne<{ count: string }>(likesSql, [postId]);
    // const likesCount = Number.parseInt(likesResult?.count || "0");

    // // Get comment count
    // const commentsSql = `SELECT COUNT(*) as count FROM comments WHERE post_id = $1`;
    // const commentsResult = await queryOne<{ count: string }>(commentsSql, [
    //   postId,
    // ]);
    // const commentsCount = Number.parseInt(commentsResult?.count || "0");

    // // Check if user has liked the post
    // let liked = false;
    // if (userId) {
    //   const likedSql = `SELECT 1 FROM post_likes WHERE post_id = $1 AND user_id = $2`;
    //   const likedResult = await queryOne(likedSql, [postId, userId]);
    //   liked = !!likedResult;
    // }

    // // Check if user has saved the post
    let saved = false;
    if (userId) {
      const savedSql = `SELECT 1 FROM saved_posts WHERE post_id = $1 AND user_id = $2`;
      const savedResult = await queryOne(savedSql, [postId, userId]);
      saved = !!savedResult;
    }

    // Return the post with additional data
    return {
      ...post,
      tags: tags,
      // likes_count: likesCount,
      // comments_count: commentsCount,
      // liked,
      saved,
    };
  } catch (error) {
    console.error("Error in getPostById:", error);
    return null;
  }
}

/**
 * Get all posts with pagination
 */
export async function getPostsByLanguage(
  page = 1,
  limit = 10,
  sortBy = "created_at",
  sortOrder = "desc",
  language = "en"
): Promise<PostType[]> {
  try {
    const offset = (page - 1) * limit;
    const sql = `
        SELECT 
          p.id, p.title, p.content, p.created_at, p.updated_at, 
          p.user_id, u.username, p.category_id, c.name as category_name,
          p.likes, p.views, p.tags, p.language,
          (SELECT jsonb_object_agg(pt.language, jsonb_build_object('title', pt.title, 'content', pt.content))
           FROM post_translations pt
           WHERE pt.post_id = p.id) as translations
        FROM posts p
        JOIN users u ON p.user_id = u.id
        JOIN categories c ON p.category_id = c.id
        WHERE p.language = $1
        ORDER BY p.${sortBy} ${sortOrder}
        LIMIT $2 OFFSET $3
      `;
    return await query<PostType>(sql, [language, limit, offset]);
  } catch (error) {
    console.error("Error getting posts:", error);
    throw error;
  }
}

export async function getPinnedPosts(limit = 10): Promise<Post[]> {
  try {
    const sql = `
      SELECT * FROM posts
      WHERE is_pinned = true
      ORDER BY created_at DESC
      LIMIT $1
    `;

    const posts = await query<Post>(sql, [limit]);
    return posts;
  } catch (error) {
    console.error("Error getting pinned posts:", error);
    return [];
  }
}

export async function getPosts(
  page = 1,
  limit = 10,
  pinned = false,
  categoryId?: string,
  userId?: string
): Promise<{ posts: Post[]; total: number }> {
  try {
    const offset = (page - 1) * limit;

    // Count total posts
    let countSql = `SELECT COUNT(*) as count FROM posts p`;
    const countParams = [];

    if (categoryId) {
      // Check if the category has any children
      const hasChildren = await queryOne<{ exists: boolean }>(
        "SELECT EXISTS(SELECT 1 FROM categories WHERE parent_id = $1) as exists",
        [categoryId]
      );

      if (hasChildren?.exists) {
        // If category has children, include posts from all child categories
        countSql += `
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE c.id = $1 OR c.parent_id = $1
        `;
      } else {
        // If no children, just get posts from this category
        countSql += ` WHERE p.category_id = $1`;
      }
      countParams.push(categoryId);
    }

    const countResult = await queryOne<{ count: string }>(
      countSql,
      countParams
    );
    const total = Number.parseInt(countResult?.count || "0");

    // Build the query for posts with comment count
    let sql = `
        SELECT 
          p.*,
          json_build_object(
            'id', u.id,
            'name', u.name,
            'username', u.username,
            'image_url', u.image_url
          ) as user,
          json_build_object(
            'id', c.id,
            'name', c.name
          ) as category,
          (
            SELECT COUNT(*) 
            FROM comments child
            LEFT JOIN comments parent ON child.parent_id = parent.id
            WHERE child.post_id = p.id
              AND (child.status IS NULL OR child.status != 'deleted')
              AND (
                child.parent_id IS NULL -- top-level comment
                OR parent.status IS DISTINCT FROM 'deleted' -- parent not deleted
              )
          ) as comments_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
      `;

    const params = [];

    // Add category filter if provided
    if (categoryId) {
      // Check if the category has any children
      const hasChildren = await queryOne<{ exists: boolean }>(
        "SELECT EXISTS(SELECT 1 FROM categories WHERE parent_id = $1) as exists",
        [categoryId]
      );

      if (hasChildren?.exists) {
        // If category has children, include posts from all child categories
        sql += ` WHERE c.id = $1 OR c.parent_id = $1`;
      } else {
        // If no children, just get posts from this category
        sql += ` WHERE p.category_id = $1`;
      }
      params.push(categoryId);
    }

    // Add order and pagination
    sql += ` ORDER BY p.created_at DESC
               LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    params.push(limit, offset);

    // Get posts
    const posts = await query<Post>(sql, params);

    if (posts.length === 0) {
      return { posts: [], total };
    }

    // Get post IDs for additional queries
    const postIds = posts.map((post) => post.id);

    // Get tags for all posts
    const tagsSql = `
        SELECT pt.post_id, t.name, t.id
        FROM post_tags pt
        JOIN tags t ON pt.tag_id = t.id
        WHERE pt.post_id = ANY($1::uuid[])
      `;

    const tagsResults = await query<{
      post_id: string;
      name: string;
      id: string;
    }>(tagsSql, [postIds]);

    // Group tags by post_id
    const tagsByPostId: Record<string, { name: string; id: string }[]> = {};
    tagsResults.forEach((tag) => {
      if (!tagsByPostId[tag.post_id]) {
        tagsByPostId[tag.post_id] = [];
      }
      tagsByPostId[tag.post_id].push({ name: tag.name, id: tag.id });
    });

    // // Get like counts for all posts
    // const likesSql = `
    //     SELECT post_id, COUNT(*) as count
    //     FROM post_likes
    //     WHERE post_id = ANY($1::uuid[])
    //     GROUP BY post_id
    //   `;
    // const likesResults = await query<{ post_id: string; count: string }>(
    //   likesSql,
    //   [postIds]
    // );

    // Create a map of like counts by post_id
    // const likesByPostId: Record<string, number> = {};
    // likesResults.forEach((like) => {
    //   likesByPostId[like.post_id] = Number.parseInt(like.count);
    // });

    // If userId is provided, check which posts the user has liked and saved
    let likedPostIds: string[] = [];
    let savedPostIds: string[] = [];

    if (userId) {
      // Get liked posts
      const likedSql = `
          SELECT post_id
          FROM post_likes
          WHERE user_id = $1 AND post_id = ANY($2::uuid[])
        `;
      const likedResults = await query<{ post_id: string }>(likedSql, [
        userId,
        postIds,
      ]);
      likedPostIds = likedResults.map((like) => like.post_id);

      // Get saved posts
      const savedSql = `
          SELECT post_id
          FROM saved_posts
          WHERE user_id = $1 AND post_id = ANY($2::uuid[])
        `;
      const savedResults = await query<{ post_id: string }>(savedSql, [
        userId,
        postIds,
      ]);
      savedPostIds = savedResults.map((saved) => saved.post_id);
    }

    // Combine all data
    const enrichedPosts = posts.map((post) => ({
      ...post,
      tags: tagsByPostId[post.id] || [],
      // likes_count: likesByPostId[post.id] || 0,
      comments_count: Number(post.comments_count) || 0,
      // liked: likedPostIds.includes(post.id),
      saved: savedPostIds.includes(post.id),
    }));

    return { posts: enrichedPosts, total };
  } catch (error) {
    console.error("Error in getPosts:", error);
    return { posts: [], total: 0 };
  }
}

export async function getUserPosts(
  userId: string,
  page = 1,
  limit = 10
): Promise<{ posts: Post[]; total: number }> {
  try {
    const offset = (page - 1) * limit;

    // Count total posts by this user
    const countSql = `SELECT COUNT(*) as count FROM posts WHERE user_id = $1`;
    const countResult = await queryOne<{ count: string }>(countSql, [userId]);
    const total = Number.parseInt(countResult?.count || "0");

    // Get posts by user
    const sql = `
        SELECT 
          p.*,
          json_build_object(
            'id', u.id,
            'name', u.name,
            'username', u.username,
            'image_url', u.image_url
          ) as user,
          json_build_object(
            'id', c.id,
            'name', c.name
          ) as category
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.user_id = $1
        ORDER BY p.created_at DESC
        LIMIT $2 OFFSET $3
      `;

    const posts = await query<Post>(sql, [userId, limit, offset]);

    if (posts.length === 0) {
      return { posts: [], total };
    }

    // Get post IDs for additional queries
    const postIds = posts.map((post) => post.id);

    // Get tags for all posts
    const tagsSql = `
        SELECT pt.post_id, t.name
        FROM post_tags pt
        JOIN tags t ON pt.tag_id = t.id
        WHERE pt.post_id = ANY($1::uuid[])
      `;
    const tagsResults = await query<{
      post_id: string;
      name: string;
      id: string;
    }>(tagsSql, [postIds]);

    // Group tags by post_id
    const tagsByPostId: Record<string, { name: string; id: string }[]> = {};
    tagsResults.forEach((tag) => {
      if (!tagsByPostId[tag.post_id]) {
        tagsByPostId[tag.post_id] = [];
      }
      tagsByPostId[tag.post_id].push({ name: tag.name, id: tag.id });
    });

    // Get like counts for all posts
    const likesSql = `
        SELECT post_id, COUNT(*) as count
        FROM post_likes
        WHERE post_id = ANY($1::uuid[])
        GROUP BY post_id
      `;
    const likesResults = await query<{ post_id: string; count: string }>(
      likesSql,
      [postIds]
    );

    // Create a map of like counts by post_id
    const likesByPostId: Record<string, number> = {};
    likesResults.forEach((like) => {
      likesByPostId[like.post_id] = Number.parseInt(like.count);
    });

    // Get comment counts for all posts
    const commentsSql = `
        SELECT post_id, COUNT(*) as count
        FROM comments
        WHERE post_id = ANY($1::uuid[])
        GROUP BY post_id
      `;
    const commentsResults = await query<{ post_id: string; count: string }>(
      commentsSql,
      [postIds]
    );

    // Create a map of comment counts by post_id
    const commentsByPostId: Record<string, number> = {};
    commentsResults.forEach((comment) => {
      commentsByPostId[comment.post_id] = Number.parseInt(comment.count);
    });

    // Combine all data
    const enrichedPosts = posts.map((post) => ({
      ...post,
      tags: tagsByPostId[post.id] || [],
      likes_count: likesByPostId[post.id] || 0,
      comments_count: commentsByPostId[post.id] || 0,
      liked: false, // Default value
      saved: false, // Default value
    }));

    return { posts: enrichedPosts, total };
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    return { posts: [], total: 0 };
  }
}

export async function getSavedPosts(
  userId: string,
  page = 1,
  limit = 10
): Promise<Post[]> {
  try {
    const offset = (page - 1) * limit;

    // Count total saved posts
    const countSql = `SELECT COUNT(*) as count FROM saved_posts WHERE user_id = $1`;
    const countResult = await queryOne<{ count: string }>(countSql, [userId]);
    const total = Number.parseInt(countResult?.count || "0");

    // Get saved post IDs with pagination
    const savedPostsSql = `
        SELECT post_id
        FROM saved_posts
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
    const savedPosts = await query<{ post_id: string }>(savedPostsSql, [
      userId,
      limit,
      offset,
    ]);

    if (savedPosts.length === 0) {
      return [];
    }

    const savedPostIds = savedPosts.map((sp) => sp.post_id);

    // Get the actual posts
    const sql = `
        SELECT 
          p.*,
          json_build_object(
            'id', u.id,
            'name', u.name,
            'username', u.username,
            'image_url', u.image_url
          ) as user,
          json_build_object(
            'id', c.id,
            'name', c.name
          ) as category
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ANY($1::uuid[])
      `;

    const posts = await query<Post>(sql, [savedPostIds]);

    // Get tags for all posts
    const tagsSql = `
        SELECT pt.post_id, t.name, t.id
        FROM post_tags pt
        JOIN tags t ON pt.tag_id = t.id
        WHERE pt.post_id = ANY($1::uuid[])
      `;
    const tagsResults = await query<{
      post_id: string;
      name: string;
      id: string;
    }>(tagsSql, [savedPostIds]);

    // Group tags by post_id
    const tagsByPostId: Record<string, { name: string; id: string }[]> = {};
    tagsResults.forEach((tag) => {
      if (!tagsByPostId[tag.post_id]) {
        tagsByPostId[tag.post_id] = [];
      }
      tagsByPostId[tag.post_id].push({ name: tag.name, id: tag.id });
    });

    // Get like counts for all posts
    const likesSql = `
        SELECT post_id, COUNT(*) as count
        FROM post_likes
        WHERE post_id = ANY($1::uuid[])
        GROUP BY post_id
      `;
    const likesResults = await query<{ post_id: string; count: string }>(
      likesSql,
      [savedPostIds]
    );

    // Create a map of like counts by post_id
    const likesByPostId: Record<string, number> = {};
    likesResults.forEach((like) => {
      likesByPostId[like.post_id] = Number.parseInt(like.count);
    });

    // Get comment counts for all posts
    const commentsSql = `
        SELECT post_id, COUNT(*) as count
        FROM comments
        WHERE post_id = ANY($1::uuid[])
        GROUP BY post_id
      `;
    const commentsResults = await query<{ post_id: string; count: string }>(
      commentsSql,
      [savedPostIds]
    );

    // Create a map of comment counts by post_id
    const commentsByPostId: Record<string, number> = {};
    commentsResults.forEach((comment) => {
      commentsByPostId[comment.post_id] = Number.parseInt(comment.count);
    });

    // Get liked posts
    const likedSql = `
        SELECT post_id
        FROM post_likes
        WHERE user_id = $1 AND post_id = ANY($2::uuid[])
      `;
    const likedResults = await query<{ post_id: string }>(likedSql, [
      userId,
      savedPostIds,
    ]);
    const likedPostIds = likedResults.map((like) => like.post_id);

    // Combine all data
    const enrichedPosts = posts.map((post) => ({
      ...post,
      tags: tagsByPostId[post.id] || [],
      likes_count: likesByPostId[post.id] || 0,
      comments_count: commentsByPostId[post.id] || 0,
      liked: likedPostIds.includes(post.id),
      saved: true, // These are saved posts
    }));

    return enrichedPosts;
  } catch (error) {
    console.error("Error in getSavedPosts:", error);
    return [];
  }
}

export async function getRelatedPosts(
  postId: string,
  categoryId?: string | null
): Promise<Post[]> {
  try {
    let relatedPosts: Post[] = [];

    if (categoryId) {
      // First try to get posts from the same category
      const categorySql = `
          SELECT 
            p.*,
            json_build_object(
              'id', u.id,
              'name', u.name,
              'username', u.username,
              'image_url', u.image_url
            ) as user,
            json_build_object(
              'id', c.id,
              'name', c.name
            ) as category
          FROM posts p
          LEFT JOIN users u ON p.user_id = u.id
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.category_id = $1
          AND p.id != $2
          ORDER BY p.created_at DESC
          LIMIT 3
        `;
      relatedPosts = await query<Post>(categorySql, [categoryId, postId]);

      // If we don't have enough posts from the same category, fetch some recent posts
      if (relatedPosts.length < 3) {
        const neededPosts = 3 - relatedPosts.length;
        const existingIds = [postId, ...relatedPosts.map((p) => p.id)];

        const recentSql = `
            SELECT 
              p.*,
              json_build_object(
                'id', u.id,
                'name', u.name,
                'username', u.username,
                'image_url', u.image_url
              ) as user,
              json_build_object(
                'id', c.id,
                'name', c.name
              ) as category
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id != ALL($1::uuid[])
            ORDER BY p.created_at DESC
            LIMIT $2
          `;
        const recentPosts = await query<Post>(recentSql, [
          existingIds,
          neededPosts,
        ]);
        relatedPosts = [...relatedPosts, ...recentPosts];
      }
    } else {
      // If no category, just get recent posts
      const recentSql = `
          SELECT 
            p.*,
            json_build_object(
              'id', u.id,
              'name', u.name,
              'username', u.username,
              'image_url', u.image_url
            ) as user,
            json_build_object(
              'id', c.id,
              'name', c.name
            ) as category
          FROM posts p
          LEFT JOIN users u ON p.user_id = u.id
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE p.id != $1
          ORDER BY p.created_at DESC
          LIMIT 3
        `;
      relatedPosts = await query<Post>(recentSql, [postId]);
    }

    // Get tags for all related posts
    if (relatedPosts.length > 0) {
      const postIds = relatedPosts.map((post) => post.id);
      const tagsSql = `
          SELECT pt.post_id, t.name, t.id
          FROM post_tags pt
          JOIN tags t ON pt.tag_id = t.id
          WHERE pt.post_id = ANY($1::uuid[])
        `;
      const tagsResults = await query<{
        post_id: string;
        name: string;
        id: string;
      }>(tagsSql, [postIds]);

      // Group tags by post_id
      const tagsByPostId: Record<string, { name: string; id: string }[]> = {};
      tagsResults.forEach((tag) => {
        if (!tagsByPostId[tag.post_id]) {
          tagsByPostId[tag.post_id] = [];
        }
        tagsByPostId[tag.post_id].push({ name: tag.name, id: tag.id });
      });

      // Add tags to each post
      relatedPosts = relatedPosts.map((post) => ({
        ...post,
        tags: tagsByPostId[post.id] || [],
      }));
    }

    return relatedPosts;
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

// Helper function to get total post count
export async function getPostCount(categoryId?: string): Promise<number> {
  try {
    let sql = "SELECT COUNT(*) FROM posts";
    const params = [];

    if (categoryId) {
      sql += " WHERE category_id = $1";
      params.push(categoryId);
    }

    const result = await queryOne(sql, params);
    return Number.parseInt(result?.count || "0");
  } catch (error) {
    console.error("Error counting posts:", error);
    return 0;
  }
}

export async function getPostsByTags(
  tagIds: string[],
  page = 1,
  limit = 10,
  userId?: string
): Promise<{ posts: Post[]; total: number }> {
  try {
    const offset = (page - 1) * limit;

    // Count total posts that match ALL tags
    const countSql = `
    SELECT COUNT(*) AS count
    FROM (
      SELECT p.id
      FROM posts p
      JOIN post_tags pt ON p.id = pt.post_id
      JOIN tags t ON pt.tag_id = t.id
      WHERE t.id = ANY($1)
      GROUP BY p.id
      HAVING COUNT(DISTINCT t.id) = $2
    ) sub
    `;

    const countResult = await queryOne<{ count: string }>(countSql, [
      tagIds,
      tagIds.length,
    ]);

    const total = Number.parseInt(countResult?.count || "0");

    // Get posts that match ALL tags
    const sql = `
      SELECT 
          p.id,
          p.title,
          p.image_url,
          p.original_link,
          p.user_id,
          p.category_id,
          p.is_pinned,
          p.created_at,
          p.updated_at,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'image_url', u.image_url
        ) as user,
        json_build_object(
          'id', c.id,
          'name', c.name
        ) as category,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id AND (status IS NULL OR status != 'deleted')) as comments_count,
        array_agg(DISTINCT t.name) as tags
      FROM posts p
      JOIN post_tags pt ON p.id = pt.post_id
      JOIN tags t ON pt.tag_id = t.id
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE t.id = ANY($1)
      GROUP BY p.id, u.id, c.id
      HAVING COUNT(DISTINCT t.id) = $2
      ORDER BY p.created_at DESC
      LIMIT $3 OFFSET $4
    `;

    const posts = await query<Post>(sql, [
      tagIds,
      tagIds.length,
      limit,
      offset,
    ]);

    const postIds = posts.map((post) => post.id);

    // Get tags for all posts
    const tagsSql = `
        SELECT pt.post_id, t.name, t.id
        FROM post_tags pt
        JOIN tags t ON pt.tag_id = t.id
        WHERE pt.post_id = ANY($1::uuid[])
      `;

    const tagsResults = await query<{
      post_id: string;
      name: string;
      id: string;
    }>(tagsSql, [postIds]);

    // Group tags by post_id
    const tagsByPostId: Record<string, { name: string; id: string }[]> = {};
    tagsResults.forEach((tag) => {
      if (!tagsByPostId[tag.post_id]) {
        tagsByPostId[tag.post_id] = [];
      }
      tagsByPostId[tag.post_id].push({ name: tag.name, id: tag.id });
    });

    // Add saved status for each post if userId is provided
    if (userId) {
      const savedPosts = await Promise.all(
        posts.map(async (post) => {
          const savedSql = `SELECT 1 FROM saved_posts WHERE post_id = $1 AND user_id = $2`;
          const savedResult = await queryOne(savedSql, [post.id, userId]);
          return {
            ...post,
            saved: !!savedResult,
          };
        })
      );
      return { posts: savedPosts, total };
    }

    posts.forEach((post) => {
      post.tags = tagsByPostId[post.id] || [];
      post.tags = post.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      }));
    });

    return { posts, total };
  } catch (error) {
    console.error("Error in queryByTags:", error);
    return { posts: [], total: 0 };
  }
}
