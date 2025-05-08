import type { Post } from "./db/posts";
import { query, queryOne } from "./db/postgres";
import { localAuth } from "./auth/local-auth";
import { createClientSupabaseClient } from "./supabase/client";

export async function getCategories() {
  try {
    const categories = await query(
      "SELECT * FROM categories ORDER BY created_at DESC"
    );
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getCategory(
  categoryId: string
): Promise<{ name: { en: string } } | null> {
  try {
    return await queryOne("SELECT name FROM categories WHERE id = $1", [
      categoryId,
    ]);
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

// Helper function to get posts with no fallback to mock data
export async function getPosts(
  page = 1,
  limit = 10,
  categoryId?: string
): Promise<Post[]> {
  try {
    // Calculate offset based on page and limit
    const offset = (page - 1) * limit;

    // Build query with proper joins
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
        ) as category
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
    `;

    const params = [];

    // Add category filter if provided
    if (categoryId) {
      sql += " WHERE p.category_id = $1";
      params.push(categoryId);
    }

    // Add order and pagination
    sql += " ORDER BY p.created_at DESC";
    sql += " LIMIT $" + (params.length + 1) + " OFFSET $" + (params.length + 2);
    params.push(limit, offset);

    // Execute query
    const posts = await query(sql, params);
    return posts as unknown as Post[];
  } catch (error) {
    console.error("Error fetching posts:", error);
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

// Helper function to get post by ID with no fallback to mock data
export async function getPostById(id: string): Promise<Post | null> {
  try {
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
      WHERE p.id = $1
    `;

    const post = await queryOne(sql, [id]);
    return post as unknown as Post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Helper function to get posts by category with no fallback to mock data
export async function getPostsByCategory(
  categoryId: string,
  page = 1,
  limit = 10
): Promise<Post[]> {
  try {
    return getPosts(page, limit, categoryId);
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return [];
  }
}

// Helper function to get category post count
export async function getCategoryPostCount(
  categoryId: string
): Promise<number> {
  return getPostCount(categoryId);
}

// Helper function to get comments by post ID
export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    const sql = `
      SELECT 
        c.*,
        json_build_object(
          'id', u.id,
          'name', u.name,
          'username', u.username,
          'image_url', u.image_url
        ) as user
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at DESC
    `;

    const comments = await query(sql, [postId]);
    return comments as unknown as Comment[];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

// Helper function to check if user is authenticated
export async function isUserAuthenticated(): Promise<boolean> {
  try {
    // If local auth is enabled, check if there's a current user
    if (localAuth.isEnabled()) {
      return !!localAuth.getCurrentUser();
    }

    // This should only be called on the client side
    if (typeof window === "undefined") {
      console.warn("isUserAuthenticated was called on the server side");
      return false;
    }

    const supabase = await createClientSupabaseClient();
    if (!supabase) return false;

    const { data } = await supabase.auth.getUser();
    return !!data.user;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
}

export async function getRelatedPosts(
  currentPostId: string,
  categoryId?: string | null
): Promise<Post[]> {
  try {
    // Validate inputs to prevent database errors
    if (!currentPostId) {
      console.error("getRelatedPosts called with undefined currentPostId");
      return [];
    }

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
        ) as category
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id != $1
    `;

    const params = [currentPostId];

    // Only add category filter if categoryId is provided and valid
    if (categoryId && categoryId !== "undefined") {
      sql += " AND p.category_id = $2";
      params.push(categoryId);
    }

    sql += " LIMIT 3";

    const posts = await query(sql, params);
    return posts as unknown as Post[];
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

export async function getRelatedPostsForServer(
  postId: string,
  categoryId?: string | null,
  limit = 3
): Promise<Post[]> {
  try {
    let relatedPosts: Post[] = [];

    // First try to get posts from the same category if available
    if (categoryId) {
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
        WHERE p.category_id = $1 AND p.id != $2
        LIMIT $3
      `;

      const categoryPosts = await query(sql, [categoryId, postId, limit]);
      relatedPosts = categoryPosts as unknown as Post[];
    }

    // If we don't have enough posts from the same category, fetch some recent posts
    if (relatedPosts.length < limit) {
      const neededPosts = limit - relatedPosts.length;
      const existingIds = [postId, ...relatedPosts.map((p) => p.id)];

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
        WHERE p.id != ALL($1::uuid[])
        ORDER BY p.created_at DESC
        LIMIT $2
      `;

      const recentPosts = await query(sql, [existingIds, neededPosts]);
      relatedPosts = [
        ...relatedPosts,
        ...(recentPosts || []),
      ] as unknown as Post[];
    }

    return relatedPosts;
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

// Helper function to get user posts
export async function getUserPosts(
  userId: string,
  page = 1,
  limit = 10
): Promise<Post[]> {
  try {
    const offset = (page - 1) * limit;

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

    const posts = await query(sql, [userId, limit, offset]);
    return posts as unknown as Post[];
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return [];
  }
}

// Helper function to get user post count
export async function getUserPostCount(userId: string): Promise<number> {
  try {
    const sql = "SELECT COUNT(*) FROM posts WHERE user_id = $1";
    const result = await queryOne(sql, [userId]);
    return Number.parseInt(result?.count || "0");
  } catch (error) {
    console.error("Error counting user posts:", error);
    return 0;
  }
}

export async function getUser(username: string) {
  try {
    return await queryOne("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function getFeaturedPosts(limit = 3) {
  try {
    const sql = `
      SELECT 
        p.*,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'avatar_url', u.image_url
        ) as users,
        json_build_object(
          'id', c.id,
          'name', c.name
        ) as categories
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = true
      ORDER BY p.created_at DESC
      LIMIT $1
    `;

    return await query(sql, [limit]);
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export async function searchPosts(query: string) {
  try {
    const sql = `
      SELECT 
        p.*,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'avatar_url', u.image_url
        ) as users,
        json_build_object(
          'id', c.id,
          'name', c.name
        ) as categories
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 
        p.title::text ILIKE $1 OR 
        p.content::text ILIKE $1
      ORDER BY p.created_at DESC
    `;

    return await query(sql, [`%${query}%`]);
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}
