"use server"

import { createClientSupabaseClient } from "@/lib/supabase/client"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export type MultilingualContent = {
  en: string
  zh?: string
  vi?: string
}

export type Post = {
  id: string
  title: MultilingualContent
  content: MultilingualContent
  excerpt?: MultilingualContent
  user_id: string
  category_id?: string | null
  image_url?: string | null
  original_link?: string | null
  is_pinned?: boolean
  created_at?: string
  updated_at?: string
  tags?: string[]
  author?: {
    id: string
    name: string
    username: string
    image_url?: string
  }
  category?: {
    id: string
    name: MultilingualContent
  }
  likes_count?: number
  comments_count?: number
  liked?: boolean
  saved?: boolean
}

export async function createPost(post: {
  user_id: string
  title: MultilingualContent
  content: MultilingualContent
  category_id?: string | null
  image_url?: string | null
  original_link?: string | null
  is_pinned?: boolean
  tags?: string[]
}): Promise<Post | null> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      console.error("Supabase client not available")
      return null
    }

    // First, create the post
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: post.user_id,
        title: post.title,
        content: post.content,
        category_id: post.category_id || null,
        image_url: post.image_url || null,
        original_link: post.original_link || null,
        is_pinned: post.is_pinned || false,
      })
      .select()
      .single()

    if (postError) {
      console.error("Error creating post:", postError)
      return null
    }

    // If tags are provided, handle them separately
    if (post.tags && post.tags.length > 0) {
      // First, ensure all tags exist in the tags table
      for (const tagName of post.tags) {
        // Check if tag exists
        const { data: existingTag } = await supabase.from("tags").select("id").eq("name", tagName).single()

        if (!existingTag) {
          // Create the tag if it doesn't exist
          const { data: newTag, error: tagError } = await supabase
            .from("tags")
            .insert({ name: tagName })
            .select()
            .single()

          if (tagError) {
            console.error("Error creating tag:", tagError)
            continue
          }

          // Link the new tag to the post
          const { error: linkError } = await supabase
            .from("post_tags")
            .insert({ post_id: postData.id, tag_id: newTag.id })

          if (linkError) {
            console.error("Error linking tag to post:", linkError)
          }
        } else {
          // Link the existing tag to the post
          const { error: linkError } = await supabase
            .from("post_tags")
            .insert({ post_id: postData.id, tag_id: existingTag.id })

          if (linkError) {
            console.error("Error linking tag to post:", linkError)
          }
        }
      }
    }

    // Return the created post with tags
    return {
      ...postData,
      tags: post.tags || [],
    } as Post
  } catch (error) {
    console.error("Error in createPost:", error)
    return null
  }
}

export async function updatePost(
  postId: string,
  updates: {
    title?: MultilingualContent
    content?: MultilingualContent
    category_id?: string | null
    image_url?: string | null
    original_link?: string | null
    is_pinned?: boolean
    tags?: string[]
  },
): Promise<Post | null> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      console.error("Supabase client not available")
      return null
    }

    // Update the post
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .update({
        title: updates.title,
        content: updates.content,
        category_id: updates.category_id,
        image_url: updates.image_url,
        original_link: updates.original_link,
        is_pinned: updates.is_pinned,
        updated_at: new Date().toISOString(),
      })
      .eq("id", postId)
      .select()
      .single()

    if (postError) {
      console.error("Error updating post:", postError)
      return null
    }

    // If tags are provided, update them
    if (updates.tags !== undefined) {
      // First, remove all existing tag associations
      const { error: deleteError } = await supabase.from("post_tags").delete().eq("post_id", postId)

      if (deleteError) {
        console.error("Error removing existing tags:", deleteError)
      }

      // Then add the new tags
      if (updates.tags && updates.tags.length > 0) {
        for (const tagName of updates.tags) {
          // Check if tag exists
          const { data: existingTag } = await supabase.from("tags").select("id").eq("name", tagName).single()

          if (!existingTag) {
            // Create the tag if it doesn't exist
            const { data: newTag, error: tagError } = await supabase
              .from("tags")
              .insert({ name: tagName })
              .select()
              .single()

            if (tagError) {
              console.error("Error creating tag:", tagError)
              continue
            }

            // Link the new tag to the post
            const { error: linkError } = await supabase.from("post_tags").insert({ post_id: postId, tag_id: newTag.id })

            if (linkError) {
              console.error("Error linking tag to post:", linkError)
            }
          } else {
            // Link the existing tag to the post
            const { error: linkError } = await supabase
              .from("post_tags")
              .insert({ post_id: postId, tag_id: existingTag.id })

            if (linkError) {
              console.error("Error linking tag to post:", linkError)
            }
          }
        }
      }
    }

    // Return the updated post with tags
    return {
      ...postData,
      tags: updates.tags || [],
    } as Post
  } catch (error) {
    console.error("Error in updatePost:", error)
    return null
  }
}

export async function getPostById(postId: string, userId?: string): Promise<Post | null> {
  try {
    const supabase = createClientSupabaseClient()
    if (!supabase) return null

    // Get the post
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:user_id (id, name, username, image_url),
        category:category_id (id, name)
      `,
      )
      .eq("id", postId)
      .single()

    if (postError) {
      console.error("Error fetching post:", postError)
      return null
    }

    // Get the tags for this post
    const { data: postTags, error: tagsError } = await supabase
      .from("post_tags")
      .select(
        `
        tag_id,
        tags (name)
      `,
      )
      .eq("post_id", postId)

    if (tagsError) {
      console.error("Error fetching post tags:", tagsError)
    }

    // Extract tag names
    const tags = postTags?.map((pt) => pt.tags.name) || []

    // Check if the user has liked the post
    let liked = false
    if (userId) {
      const { data: likeData } = await supabase
        .from("post_likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single()

      liked = !!likeData
    }

    // Check if the user has saved the post
    let saved = false
    if (userId) {
      const { data: saveData } = await supabase
        .from("saved_posts")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single()

      saved = !!saveData
    }

    // Get like count
    const { count: likesCount, error: likesError } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)

    if (likesError) {
      console.error("Error counting likes:", likesError)
    }

    // Get comment count
    const { count: commentsCount, error: commentsError } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("post_id", postId)

    if (commentsError) {
      console.error("Error counting comments:", commentsError)
    }

    // Return the post with additional data
    return {
      ...post,
      tags,
      liked,
      saved,
      likes_count: likesCount || 0,
      comments_count: commentsCount || 0,
    } as Post
  } catch (error) {
    console.error("Error in getPostById:", error)
    return null
  }
}

export async function deletePost(postId: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient()
    if (!supabase) {
      console.error("Supabase client not available")
      return false
    }

    // First delete all tag associations
    const { error: tagsError } = await supabase.from("post_tags").delete().eq("post_id", postId)

    if (tagsError) {
      console.error("Error deleting post tags:", tagsError)
    }

    // Delete likes
    const { error: likesError } = await supabase.from("post_likes").delete().eq("post_id", postId)

    if (likesError) {
      console.error("Error deleting post likes:", likesError)
    }

    // Delete saved posts
    const { error: savedError } = await supabase.from("saved_posts").delete().eq("post_id", postId)

    if (savedError) {
      console.error("Error deleting saved posts:", savedError)
    }

    // Delete comments
    const { error: commentsError } = await supabase.from("comments").delete().eq("post_id", postId)

    if (commentsError) {
      console.error("Error deleting comments:", commentsError)
    }

    // Finally delete the post
    const { error: postError } = await supabase.from("posts").delete().eq("id", postId)

    if (postError) {
      console.error("Error deleting post:", postError)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deletePost:", error)
    return false
  }
}

export async function getPosts(
  page = 1,
  limit = 10,
  categoryId?: string,
  userId?: string,
): Promise<{ posts: Post[]; total: number }> {
  try {
    const supabase = createClientSupabaseClient()
    if (!supabase) return { posts: [], total: 0 }

    const offset = (page - 1) * limit

    // Build the query
    let query = supabase
      .from("posts")
      .select(
        `
        *,
        user:user_id (id, name, username, image_url),
        category:category_id (id, name)
      `,
        { count: "exact" },
      )
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // Add category filter if provided
    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    // Execute the query
    const { data: posts, error: postsError, count } = await query

    if (postsError) {
      console.error("Error fetching posts:", postsError)
      return { posts: [], total: 0 }
    }

    // Get tags for all posts
    const postIds = posts.map((post) => post.id)
    const { data: allPostTags, error: tagsError } = await supabase
      .from("post_tags")
      .select(
        `
        post_id,
        tag_id,
        tags (name)
      `,
      )
      .in("post_id", postIds)

    if (tagsError) {
      console.error("Error fetching post tags:", tagsError)
    }

    // Group tags by post_id
    const tagsByPostId: Record<string, string[]> = {}
    allPostTags?.forEach((pt) => {
      if (!tagsByPostId[pt.post_id]) {
        tagsByPostId[pt.post_id] = []
      }
      tagsByPostId[pt.post_id].push(pt.tags.name)
    })

    // Get like counts for all posts
    const { data: allLikes, error: likesError } = await supabase
      .from("post_likes")
      .select("post_id")
      .in("post_id", postIds)

    if (likesError) {
      console.error("Error fetching post likes:", likesError)
    }

    // Count likes by post_id
    const likesByPostId: Record<string, number> = {}
    allLikes?.forEach((like) => {
      likesByPostId[like.post_id] = (likesByPostId[like.post_id] || 0) + 1
    })

    // Get comment counts for all posts
    const { data: allComments, error: commentsError } = await supabase
      .from("comments")
      .select("post_id")
      .in("post_id", postIds)

    if (commentsError) {
      console.error("Error fetching post comments:", commentsError)
    }

    // Count comments by post_id
    const commentsByPostId: Record<string, number> = {}
    allComments?.forEach((comment) => {
      commentsByPostId[comment.post_id] = (commentsByPostId[comment.post_id] || 0) + 1
    })

    // Check which posts the user has liked
    let likedPostIds: string[] = []
    if (userId) {
      const { data: userLikes, error: userLikesError } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", postIds)

      if (userLikesError) {
        console.error("Error fetching user likes:", userLikesError)
      } else {
        likedPostIds = userLikes?.map((like) => like.post_id) || []
      }
    }

    // Check which posts the user has saved
    let savedPostIds: string[] = []
    if (userId) {
      const { data: userSaved, error: userSavedError } = await supabase
        .from("saved_posts")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", postIds)

      if (userSavedError) {
        console.error("Error fetching user saved posts:", userSavedError)
      } else {
        savedPostIds = userSaved?.map((saved) => saved.post_id) || []
      }
    }

    // Combine all data
    const enrichedPosts = posts.map((post) => ({
      ...post,
      tags: tagsByPostId[post.id] || [],
      likes_count: likesByPostId[post.id] || 0,
      comments_count: commentsByPostId[post.id] || 0,
      liked: likedPostIds.includes(post.id),
      saved: savedPostIds.includes(post.id),
    }))

    return { posts: enrichedPosts as Post[], total: count || 0 }
  } catch (error) {
    console.error("Error in getPosts:", error)
    return { posts: [], total: 0 }
  }
}

export async function getUserPosts(userId: string, page = 1, limit = 10): Promise<{ posts: Post[]; total: number }> {
  try {
    const supabase = createClientSupabaseClient()
    if (!supabase) return { posts: [], total: 0 }

    const offset = (page - 1) * limit

    // Get posts by user
    const {
      data: posts,
      error: postsError,
      count,
    } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:user_id (id, name, username, image_url),
        category:category_id (id, name)
      `,
        { count: "exact" },
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (postsError) {
      console.error("Error fetching user posts:", postsError)
      return { posts: [], total: 0 }
    }

    // Get tags for all posts
    const postIds = posts.map((post) => post.id)
    const { data: allPostTags, error: tagsError } = await supabase
      .from("post_tags")
      .select(
        `
        post_id,
        tag_id,
        tags (name)
      `,
      )
      .in("post_id", postIds)

    if (tagsError) {
      console.error("Error fetching post tags:", tagsError)
    }

    // Group tags by post_id
    const tagsByPostId: Record<string, string[]> = {}
    allPostTags?.forEach((pt) => {
      if (!tagsByPostId[pt.post_id]) {
        tagsByPostId[pt.post_id] = []
      }
      tagsByPostId[pt.post_id].push(pt.tags.name)
    })

    // Get like counts for all posts
    const { data: allLikes, error: likesError } = await supabase
      .from("post_likes")
      .select("post_id")
      .in("post_id", postIds)

    if (likesError) {
      console.error("Error fetching post likes:", likesError)
    }

    // Count likes by post_id
    const likesByPostId: Record<string, number> = {}
    allLikes?.forEach((like) => {
      likesByPostId[like.post_id] = (likesByPostId[like.post_id] || 0) + 1
    })

    // Get comment counts for all posts
    const { data: allComments, error: commentsError } = await supabase
      .from("comments")
      .select("post_id")
      .in("post_id", postIds)

    if (commentsError) {
      console.error("Error fetching post comments:", commentsError)
    }

    // Count comments by post_id
    const commentsByPostId: Record<string, number> = {}
    allComments?.forEach((comment) => {
      commentsByPostId[comment.post_id] = (commentsByPostId[comment.post_id] || 0) + 1
    })

    // Combine all data
    const enrichedPosts = posts.map((post) => ({
      ...post,
      tags: tagsByPostId[post.id] || [],
      likes_count: likesByPostId[post.id] || 0,
      comments_count: commentsByPostId[post.id] || 0,
      liked: false, // Default value
      saved: false, // Default value
    }))

    return { posts: enrichedPosts as Post[], total: count || 0 }
  } catch (error) {
    console.error("Error in getUserPosts:", error)
    return { posts: [], total: 0 }
  }
}

export async function getSavedPosts(userId: string, page = 1, limit = 10): Promise<{ posts: Post[]; total: number }> {
  try {
    const supabase = createClientSupabaseClient()
    if (!supabase) return { posts: [], total: 0 }

    const offset = (page - 1) * limit

    // Get saved post IDs
    const {
      data: savedPosts,
      error: savedError,
      count,
    } = await supabase
      .from("saved_posts")
      .select("post_id", { count: "exact" })
      .eq("user_id", userId)
      .range(offset, offset + limit - 1)

    if (savedError) {
      console.error("Error fetching saved posts:", savedError)
      return { posts: [], total: 0 }
    }

    if (!savedPosts || savedPosts.length === 0) {
      return { posts: [], total: 0 }
    }

    // Get the actual posts
    const savedPostIds = savedPosts.map((sp) => sp.post_id)
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:user_id (id, name, username, image_url),
        category:category_id (id, name)
      `,
      )
      .in("id", savedPostIds)

    if (postsError) {
      console.error("Error fetching saved post details:", postsError)
      return { posts: [], total: 0 }
    }

    // Get tags for all posts
    const { data: allPostTags, error: tagsError } = await supabase
      .from("post_tags")
      .select(
        `
        post_id,
        tag_id,
        tags (name)
      `,
      )
      .in("post_id", savedPostIds)

    if (tagsError) {
      console.error("Error fetching post tags:", tagsError)
    }

    // Group tags by post_id
    const tagsByPostId: Record<string, string[]> = {}
    allPostTags?.forEach((pt) => {
      if (!tagsByPostId[pt.post_id]) {
        tagsByPostId[pt.post_id] = []
      }
      tagsByPostId[pt.post_id].push(pt.tags.name)
    })

    // Get like counts for all posts
    const { data: allLikes, error: likesError } = await supabase
      .from("post_likes")
      .select("post_id")
      .in("post_id", savedPostIds)

    if (likesError) {
      console.error("Error fetching post likes:", likesError)
    }

    // Count likes by post_id
    const likesByPostId: Record<string, number> = {}
    allLikes?.forEach((like) => {
      likesByPostId[like.post_id] = (likesByPostId[like.post_id] || 0) + 1
    })

    // Get comment counts for all posts
    const { data: allComments, error: commentsError } = await supabase
      .from("comments")
      .select("post_id")
      .in("post_id", savedPostIds)

    if (commentsError) {
      console.error("Error fetching post comments:", commentsError)
    }

    // Count comments by post_id
    const commentsByPostId: Record<string, number> = {}
    allComments?.forEach((comment) => {
      commentsByPostId[comment.post_id] = (commentsByPostId[comment.post_id] || 0) + 1
    })

    // Check which posts the user has liked
    const { data: userLikes, error: userLikesError } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", userId)
      .in("post_id", savedPostIds)

    if (userLikesError) {
      console.error("Error fetching user likes:", userLikesError)
    }

    const likedPostIds = userLikes?.map((like) => like.post_id) || []

    // Combine all data
    const enrichedPosts = posts.map((post) => ({
      ...post,
      tags: tagsByPostId[post.id] || [],
      likes_count: likesByPostId[post.id] || 0,
      comments_count: commentsByPostId[post.id] || 0,
      liked: likedPostIds.includes(post.id),
      saved: true, // These are saved posts
    }))

    return { posts: enrichedPosts as Post[], total: count || 0 }
  } catch (error) {
    console.error("Error in getSavedPosts:", error)
    return { posts: [], total: 0 }
  }
}

export async function getPostsByTag(
  tagName: string,
  page = 1,
  limit = 10,
  userId?: string,
): Promise<{ posts: Post[]; total: number }> {
  try {
    const supabase = createClientSupabaseClient()
    if (!supabase) return { posts: [], total: 0 }

    // First get the tag ID
    const { data: tag, error: tagError } = await supabase.from("tags").select("id").eq("name", tagName).single()

    if (tagError || !tag) {
      console.error("Error fetching tag:", tagError)
      return { posts: [], total: 0 }
    }

    const offset = (page - 1) * limit

    // Get post IDs with this tag
    const {
      data: postTags,
      error: postTagsError,
      count,
    } = await supabase
      .from("post_tags")
      .select("post_id", { count: "exact" })
      .eq("tag_id", tag.id)
      .range(offset, offset + limit - 1)

    if (postTagsError) {
      console.error("Error fetching posts with tag:", postTagsError)
      return { posts: [], total: 0 }
    }

    if (!postTags || postTags.length === 0) {
      return { posts: [], total: 0 }
    }

    // Get the actual posts
    const postIds = postTags.map((pt) => pt.post_id)
    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:user_id (id, name, username, image_url),
        category:category_id (id, name)
      `,
      )
      .in("id", postIds)

    if (postsError) {
      console.error("Error fetching posts by tag:", postsError)
      return { posts: [], total: 0 }
    }

    // Get tags for all posts
    const { data: allPostTags, error: tagsError } = await supabase
      .from("post_tags")
      .select(
        `
        post_id,
        tag_id,
        tags (name)
      `,
      )
      .in("post_id", postIds)

    if (tagsError) {
      console.error("Error fetching post tags:", tagsError)
    }

    // Group tags by post_id
    const tagsByPostId: Record<string, string[]> = {}
    allPostTags?.forEach((pt) => {
      if (!tagsByPostId[pt.post_id]) {
        tagsByPostId[pt.post_id] = []
      }
      tagsByPostId[pt.post_id].push(pt.tags.name)
    })

    // Get like counts for all posts
    const { data: allLikes, error: likesError } = await supabase
      .from("post_likes")
      .select("post_id")
      .in("post_id", postIds)

    if (likesError) {
      console.error("Error fetching post likes:", likesError)
    }

    // Count likes by post_id
    const likesByPostId: Record<string, number> = {}
    allLikes?.forEach((like) => {
      likesByPostId[like.post_id] = (likesByPostId[like.post_id] || 0) + 1
    })

    // Get comment counts for all posts
    const { data: allComments, error: commentsError } = await supabase
      .from("comments")
      .select("post_id")
      .in("post_id", postIds)

    if (commentsError) {
      console.error("Error fetching post comments:", commentsError)
    }

    // Count comments by post_id
    const commentsByPostId: Record<string, number> = {}
    allComments?.forEach((comment) => {
      commentsByPostId[comment.post_id] = (commentsByPostId[comment.post_id] || 0) + 1
    })

    // Check which posts the user has liked
    let likedPostIds: string[] = []
    if (userId) {
      const { data: userLikes, error: userLikesError } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", postIds)

      if (userLikesError) {
        console.error("Error fetching user likes:", userLikesError)
      } else {
        likedPostIds = userLikes?.map((like) => like.post_id) || []
      }
    }

    // Check which posts the user has saved
    let savedPostIds: string[] = []
    if (userId) {
      const { data: userSaved, error: userSavedError } = await supabase
        .from("saved_posts")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", postIds)

      if (userSavedError) {
        console.error("Error fetching user saved posts:", userSavedError)
      } else {
        savedPostIds = userSaved?.map((saved) => saved.post_id) || []
      }
    }

    // Combine all data
    const enrichedPosts = posts.map((post) => ({
      ...post,
      tags: tagsByPostId[post.id] || [],
      likes_count: likesByPostId[post.id] || 0,
      comments_count: commentsByPostId[post.id] || 0,
      liked: likedPostIds.includes(post.id),
      saved: savedPostIds.includes(post.id),
    }))

    return { posts: enrichedPosts as Post[], total: count || 0 }
  } catch (error) {
    console.error("Error in getPostsByTag:", error)
    return { posts: [], total: 0 }
  }
}
