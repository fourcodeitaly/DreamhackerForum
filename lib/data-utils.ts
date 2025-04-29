import * as mockData from "./mock-data"
import { getPosts as getSupabasePosts } from "./db/posts"

// Helper function to get posts with fallback to mock data
export async function getPosts(page = 1, limit = 10, categoryId?: string): Promise<any[]> {
  try {
    // Try to get real data from Supabase
    const posts = await getSupabasePosts(page, limit, categoryId)
    return posts
  } catch (error) {
    console.error("Error fetching posts from Supabase, falling back to mock data:", error)
    // Fall back to mock data
    return mockData.getMockPosts(page, limit)
  }
}

// Helper function to get post by ID with fallback to mock data
export async function getPostById(id: string): Promise<any> {
  try {
    // Try to get real data from Supabase
    const post = await import("./db/posts").then((module) => module.getPostById(id))
    if (post) return post
  } catch (error) {
    console.error("Error fetching post from Supabase, falling back to mock data:", error)
  }

  // Fall back to mock data
  return mockData.getMockPostById(id)
}

// Helper function to get posts by category with fallback to mock data
export async function getPostsByCategory(categoryId: string): Promise<any[]> {
  try {
    // Try to get real data from Supabase
    const posts = await getSupabasePosts(1, 100, categoryId)
    return posts
  } catch (error) {
    console.error("Error fetching category posts from Supabase, falling back to mock data:", error)
    // Fall back to mock data
    return mockData.getMockPostsByCategory(categoryId)
  }
}

// Helper function to normalize post data structure
export function normalizePostData(post: any): any {
  // If it's already in the expected format, return as is
  if (post && typeof post.title === "object" && typeof post.content === "object") {
    return post
  }

  // If it's mock data, convert to the expected format
  if (post) {
    return {
      ...post,
      title: {
        en: post.title || "",
        zh: post.title ? `[中文] ${post.title}` : "",
        vi: post.title ? `[Tiếng Việt] ${post.title}` : "",
      },
      content: {
        en: post.content || "",
        zh: post.content
          ? post.content
              .split("\n")
              .map((p: string) => `[中文] ${p}`)
              .join("\n")
          : "",
        vi: post.content
          ? post.content
              .split("\n")
              .map((p: string) => `[Tiếng Việt] ${p}`)
              .join("\n")
          : "",
      },
      excerpt: post.excerpt
        ? {
            en: post.excerpt,
            zh: `[中文] ${post.excerpt}`,
            vi: `[Tiếng Việt] ${post.excerpt}`,
          }
        : undefined,
    }
  }

  return post
}
