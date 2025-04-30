import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import type { Post } from "./db/posts";
import { createClientSupabaseClient } from "./supabase/client";

// Helper function to get posts with no fallback to mock data
export async function getPosts(
  page = 1,
  limit = 10,
  categoryId?: string
): Promise<Post[]> {
  try {
    // Create a Supabase client
    const supabase = createClientSupabaseClient();
    if (!supabase) {
      console.error("Failed to create Supabase client in getPosts");
      return [];
    }

    // Calculate offset based on page and limit
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from("posts")
      .select(
        `
        *,
        user:user_id (id, name, username, image_url),
        category:category_id (id, name)
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Add category filter if provided
    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error("Supabase error in getPosts:", error);
      return [];
    }

    return data as unknown as Post[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

// Helper function to get post by ID with no fallback to mock data
export async function getPostById(
  id: string,
  cookieStore: ReadonlyRequestCookies
): Promise<Post | null> {
  try {
    const supabase = await createClientSupabaseClient();
    if (!supabase) {
      console.error("Failed to create Supabase client in getPostById");
      return null;
    }

    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:user_id (id, name, username, image_url),
        category:category_id (id, name)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error in getPostById:", error);
      return null;
    }

    return data as unknown as Post;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Helper function to get posts by category with no fallback to mock data
export async function getPostsByCategory(categoryId: string): Promise<Post[]> {
  try {
    return getPosts(1, 100, categoryId);
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return [];
  }
}

// Helper function to get comments by post ID
export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    // Use server client on server, client client on client
    const supabase = await createClientSupabaseClient();
    if (!supabase) {
      console.error("Failed to create Supabase client in getCommentsByPostId");
      return [];
    }

    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        user:user_id(id, name, username, image_url)
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      return [];
    }

    return data as unknown as Comment[];
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

// Helper function to check if user is authenticated with Supabase
export async function isUserAuthenticated(): Promise<boolean> {
  try {
    // This should only be called on the client side
    if (typeof window === "undefined") {
      console.warn("isUserAuthenticated was called on the server side");
      return false;
    }

    const supabase = await createClientSupabaseClient();

    if (!supabase) return false;

    const { data } = await supabase.auth.getSession();
    return !!data.session;
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

    const supabase = await createClientSupabaseClient();
    if (!supabase) {
      console.error("Failed to create Supabase client in getRelatedPosts");
      return [];
    }

    // Start with a base query that doesn't include the current post
    let query = supabase.from("posts").select("*").limit(3);

    // Only add the not-equal filter if currentPostId is valid
    if (currentPostId && currentPostId !== "undefined") {
      query = query.neq("id", currentPostId);
    }

    // Only add category filter if categoryId is provided and valid
    if (categoryId && categoryId !== "undefined") {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching related posts:", error);
      return [];
    }

    return data as Post[];
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

export async function getCategory(
  categoryId: string
): Promise<{ name: { en: string } } | null> {
  try {
    const supabase = await createClientSupabaseClient();
    if (!supabase) {
      console.error("Failed to create Supabase client in getCategory");
      return null;
    }

    const { data, error } = await supabase
      .from("categories")
      .select("name")
      .eq("id", categoryId)
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      return null;
    }

    return data as { name: { en: string } } | null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

// Add this function to your existing data-utils.ts file

export async function getRelatedPostsForServer(
  postId: string,
  categoryId?: string | null,
  limit = 3
): Promise<Post[]> {
  try {
    const supabase = await createClientSupabaseClient();
    if (!supabase) {
      console.error(
        "Failed to create Supabase client in getRelatedPostsForServer"
      );
      return [];
    }

    let relatedPosts: Post[] = [];

    // First try to get posts from the same category if available
    if (categoryId) {
      const { data: categoryPosts } = await supabase
        .from("posts")
        .select(
          `
          *,
          user:user_id (id, name, username, image_url),
          category:category_id (id, name)
        `
        )
        .eq("category_id", categoryId)
        .neq("id", postId)
        .limit(limit);

      relatedPosts = (categoryPosts || []) as unknown as Post[];
    }

    // If we don't have enough posts from the same category, fetch some recent posts
    if (relatedPosts.length < limit) {
      const neededPosts = limit - relatedPosts.length;
      const existingIds = [postId, ...relatedPosts.map((p) => p.id)];

      const { data: recentPosts } = await supabase
        .from("posts")
        .select(
          `
          *,
          user:user_id (id, name, username, image_url),
          category:category_id (id, name)
        `
        )
        .not("id", "in", `(${existingIds.join(",")})`)
        .order("created_at", { ascending: false })
        .limit(neededPosts);

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
