import type { Post } from "./db/posts"

// Helper function to get posts with no fallback to mock data
export async function getPosts(page = 1, limit = 10, categoryId?: string): Promise<Post[]> {
  try {
    // Get real data from Supabase
    const { getPosts: getSupabasePosts } = await import("./db/posts")
    const posts = await getSupabasePosts(page, limit, categoryId)
    return posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

// Helper function to get post by ID with no fallback to mock data
export async function getPostById(id: string): Promise<Post | null> {
  try {
    // Get real data from Supabase
    const { getPostById: getSupabasePostById } = await import("./db/posts")
    const post = await getSupabasePostById(id)
    return post
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

// Helper function to get posts by category with no fallback to mock data
export async function getPostsByCategory(categoryId: string): Promise<Post[]> {
  try {
    // Get real data from Supabase
    const { getPosts: getSupabasePosts } = await import("./db/posts")
    const posts = await getSupabasePosts(1, 100, categoryId)
    return posts
  } catch (error) {
    console.error("Error fetching category posts:", error)
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
