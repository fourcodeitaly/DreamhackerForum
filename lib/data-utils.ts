import type { Post } from "./db/posts"
import type { Comment } from "./db/comments"
import { createUniversalSupabaseClient } from "./supabase"

// Helper function to get posts with no fallback to mock data
export async function getPosts(page = 1, limit = 10, categoryId?: string): Promise<Post[]> {
  try {
    // Create a Supabase client
    const supabase = createUniversalSupabaseClient()
    if (!supabase) {
      console.error("Failed to create Supabase client in getPosts")
      return []
    }

    // Calculate offset based on page and limit
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from("posts")
      .select(`
        *,
        user:user_id (id, name, username, image_url),
        category:category_id (id, name)
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Add category filter if provided
    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    // Execute query
    const { data, error } = await query

    if (error) {
      console.error("Supabase error in getPosts:", error)
      return []
    }

    return data as Post[]
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

// Helper function to get post by ID with no fallback to mock data
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const { createServerSupabaseClient } = await import("./supabase")
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      console.error("Failed to create Supabase client in getPostById")
      return null
    }

    const { data, error } = await supabase
      .from("posts")
      .select(`
        *,
        user:user_id (id, name, username, image_url),
        category:category_id (id, name)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Supabase error in getPostById:", error)
      return null
    }

    return data as Post
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

// Helper function to get posts by category with no fallback to mock data
export async function getPostsByCategory(categoryId: string): Promise<Post[]> {
  try {
    return getPosts(1, 100, categoryId)
  } catch (error) {
    console.error("Error fetching category posts:", error)
    return []
  }
}

// Helper function to get comments by post ID
export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    // Use server client on server, client client on client
    const supabase = createUniversalSupabaseClient()
    if (!supabase) {
      console.error("Failed to create Supabase client in getCommentsByPostId")
      return []
    }

    const { data, error } = await supabase
      .from("comments")
      .select(`
        *,
        user:user_id(id, name, username, image_url)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching comments:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

// Helper function to normalize post data structure
export function normalizePostData(post: any): any {
  // If it's already in the expected format, return as is
  if (post && typeof post.title === "object" && typeof post.content === "object") {
    return post
  }

  // Convert to the expected format
  if (post) {
    return {
      ...post,
      title: {
        en: post.title || "",
        zh: post.title_zh || "",
        vi: post.title_vi || "",
      },
      content: {
        en: post.content || "",
        zh: post.content_zh || "",
        vi: post.content_vi || "",
      },
      excerpt: post.excerpt
        ? {
            en: post.excerpt,
            zh: post.excerpt_zh || "",
            vi: post.excerpt_vi || "",
          }
        : undefined,
    }
  }

  return post
}

// Helper function to check if user is authenticated with Supabase
export async function isUserAuthenticated(): Promise<boolean> {
  try {
    // This should only be called on the client side
    if (typeof window === "undefined") {
      console.warn("isUserAuthenticated was called on the server side")
      return false
    }

    const { createSafeClientSupabaseClient } = await import("./supabase")
    const supabase = createSafeClientSupabaseClient()

    if (!supabase) return false

    const { data } = await supabase.auth.getSession()
    return !!data.session
  } catch (error) {
    console.error("Error checking authentication:", error)
    return false
  }
}

export async function getRelatedPosts(currentPostId: string, categoryId?: string | null): Promise<Post[]> {
  try {
    // Validate inputs to prevent database errors
    if (!currentPostId) {
      console.error("getRelatedPosts called with undefined currentPostId")
      return []
    }

    const supabase = createUniversalSupabaseClient()
    if (!supabase) {
      console.error("Failed to create Supabase client in getRelatedPosts")
      return []
    }

    // Start with a base query that doesn't include the current post
    let query = supabase.from("posts").select("*").limit(3)

    // Only add the not-equal filter if currentPostId is valid
    if (currentPostId && currentPostId !== "undefined") {
      query = query.neq("id", currentPostId)
    }

    // Only add category filter if categoryId is provided and valid
    if (categoryId && categoryId !== "undefined") {
      query = query.eq("category_id", categoryId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching related posts:", error)
      return []
    }

    return data as Post[]
  } catch (error) {
    console.error("Error fetching related posts:", error)
    return []
  }
}

export async function getCategory(categoryId: string): Promise<{ name: { en: string } } | null> {
  try {
    const supabase = createUniversalSupabaseClient()
    if (!supabase) {
      console.error("Failed to create Supabase client in getCategory")
      return null
    }

    const { data, error } = await supabase.from("categories").select("name").eq("id", categoryId).single()

    if (error) {
      console.error("Error fetching category:", error)
      return null
    }

    return data as { name: { en: string } } | null
  } catch (error) {
    console.error("Error fetching category:", error)
    return null
  }
}
