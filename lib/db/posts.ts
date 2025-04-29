import { createServerSupabaseClient } from "../supabase"
import type { User } from "./users"

export type MultilingualContent = {
  en: string
  zh?: string
  vi?: string
}

export type Post = {
  id: string
  user_id: string
  category_id?: string
  title: MultilingualContent
  content: MultilingualContent
  excerpt?: MultilingualContent
  image_url?: string
  is_pinned: boolean
  created_at: string
  updated_at: string
  // Joined fields
  author?: User
  tags?: string[]
  likes_count?: number
  comments_count?: number
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("posts").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching post:", error)
    return null
  }

  // Get post author
  const { data: userData } = await supabase.from("users").select("*").eq("id", data.user_id).single()

  // Get post tags
  const { data: tagsData } = await supabase.from("post_tags").select("tags(name)").eq("post_id", id)

  // Get likes count
  const { count: likesCount } = await supabase
    .from("post_likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", id)

  // Get comments count
  const { count: commentsCount } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("post_id", id)

  return {
    ...data,
    author: userData,
    tags: tagsData?.map((tag) => tag.tags.name) || [],
    likes_count: likesCount || 0,
    comments_count: commentsCount || 0,
  } as Post
}

export async function getPosts(page = 1, limit = 10, category_id?: string): Promise<Post[]> {
  const supabase = createServerSupabaseClient()

  const offset = (page - 1) * limit

  let query = supabase
    .from("posts")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (category_id) {
    query = query.eq("category_id", category_id)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  // Get additional data for each post
  const postsWithDetails = await Promise.all(
    data.map(async (post) => {
      // Get post author
      const { data: userData } = await supabase.from("users").select("*").eq("id", post.user_id).single()

      // Get post tags
      const { data: tagsData } = await supabase.from("post_tags").select("tags(name)").eq("post_id", post.id)

      // Get likes count
      const { count: likesCount } = await supabase
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      // Get comments count
      const { count: commentsCount } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", post.id)

      return {
        ...post,
        author: userData,
        tags: tagsData?.map((tag) => tag.tags.name) || [],
        likes_count: likesCount || 0,
        comments_count: commentsCount || 0,
      }
    }),
  )

  return postsWithDetails as Post[]
}

export async function createPost(postData: Omit<Post, "id" | "created_at" | "updated_at">): Promise<Post | null> {
  const supabase = createServerSupabaseClient()

  // Insert post
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        user_id: postData.user_id,
        category_id: postData.category_id,
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        image_url: postData.image_url,
        is_pinned: postData.is_pinned || false,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating post:", error)
    return null
  }

  // Insert tags if provided
  if (postData.tags && postData.tags.length > 0) {
    for (const tagName of postData.tags) {
      // First check if tag exists
      let tagId: number

      const { data: existingTag } = await supabase.from("tags").select("id").eq("name", tagName).single()

      if (existingTag) {
        tagId = existingTag.id
      } else {
        // Create new tag
        const { data: newTag } = await supabase
          .from("tags")
          .insert([{ name: tagName }])
          .select()
          .single()

        if (!newTag) continue
        tagId = newTag.id
      }

      // Link tag to post
      await supabase.from("post_tags").insert([{ post_id: data.id, tag_id: tagId }])
    }
  }

  return getPostById(data.id)
}

export async function updatePost(id: string, postData: Partial<Post>): Promise<Post | null> {
  const supabase = createServerSupabaseClient()

  // Update post
  const { data, error } = await supabase
    .from("posts")
    .update({
      ...postData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating post:", error)
    return null
  }

  // Update tags if provided
  if (postData.tags) {
    // First remove existing tags
    await supabase.from("post_tags").delete().eq("post_id", id)

    // Then add new tags
    for (const tagName of postData.tags) {
      // Check if tag exists
      let tagId: number

      const { data: existingTag } = await supabase.from("tags").select("id").eq("name", tagName).single()

      if (existingTag) {
        tagId = existingTag.id
      } else {
        // Create new tag
        const { data: newTag } = await supabase
          .from("tags")
          .insert([{ name: tagName }])
          .select()
          .single()

        if (!newTag) continue
        tagId = newTag.id
      }

      // Link tag to post
      await supabase.from("post_tags").insert([{ post_id: id, tag_id: tagId }])
    }
  }

  return getPostById(id)
}
