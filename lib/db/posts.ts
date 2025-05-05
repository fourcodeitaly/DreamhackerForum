"use server"

import { query, queryOne, transaction } from "../db/postgres"

export type MultilingualContent = {
  en: string
  zh?: string
  vi?: string
  it?: string
  // Add more languages as needed
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
  is_featured?: boolean
  view_count?: number
  user?: {
    id: string
    name: string
    username: string
    image_url?: string
  }
}

export async function createPost(postData: {
  user_id: string
  title: MultilingualContent
  content: MultilingualContent
  category_id?: string
  tags?: string[]
  image_url?: string
  original_link?: string | null
  is_pinned?: boolean
}): Promise<Post | null> {
  try {
    const now = new Date().toISOString()

    const sql = `
      INSERT INTO posts (
        user_id, title, content, category_id, tags, 
        image_url, original_link, is_pinned, created_at, updated_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `

    const values = [
      postData.user_id,
      JSON.stringify(postData.title),
      JSON.stringify(postData.content),
      postData.category_id || null,
      postData.tags || [],
      postData.image_url || null,
      postData.original_link || null,
      postData.is_pinned || false,
      now,
      now,
    ]

    return await queryOne<Post>(sql, values)
  } catch (error) {
    console.error("Error creating post:", error)
    return null
  }
}

export async function updatePost(
  postId: string,
  postData: {
    title?: MultilingualContent
    content?: MultilingualContent
    category_id?: string
    tags?: string[]
    image_url?: string
    original_link?: string | null
    is_pinned?: boolean
  },
): Promise<Post | null> {
  try {
    // Build dynamic update query
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    // Add each field to the update query if it exists
    if (postData.title) {
      updates.push(`title = $${paramIndex}`)
      values.push(JSON.stringify(postData.title))
      paramIndex++
    }

    if (postData.content) {
      updates.push(`content = $${paramIndex}`)
      values.push(JSON.stringify(postData.content))
      paramIndex++
    }

    if (postData.category_id !== undefined) {
      updates.push(`category_id = $${paramIndex}`)
      values.push(postData.category_id)
      paramIndex++
    }

    if (postData.tags !== undefined) {
      updates.push(`tags = $${paramIndex}`)
      values.push(postData.tags)
      paramIndex++
    }

    if (postData.image_url !== undefined) {
      updates.push(`image_url = $${paramIndex}`)
      values.push(postData.image_url)
      paramIndex++
    }

    if (postData.original_link !== undefined) {
      updates.push(`original_link = $${paramIndex}`)
      values.push(postData.original_link)
      paramIndex++
    }

    if (postData.is_pinned !== undefined) {
      updates.push(`is_pinned = $${paramIndex}`)
      values.push(postData.is_pinned)
      paramIndex++
    }

    // Add updated_at timestamp
    updates.push(`updated_at = $${paramIndex}`)
    values.push(new Date().toISOString())
    paramIndex++

    // Add the post ID as the last parameter
    values.push(postId)

    // Construct the final query
    const sql = `
      UPDATE posts 
      SET ${updates.join(", ")} 
      WHERE id = $${paramIndex}
      RETURNING *
    `

    return await queryOne<Post>(sql, values)
  } catch (error) {
    console.error("Error updating post:", error)
    return null
  }
}

export async function getPostById(postId: string, userId?: string): Promise<Post | null> {
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
        ) as user,
        json_build_object(
          'id', c.id,
          'name', c.name
        ) as category
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `

    const post = await queryOne<Post>(sql, [postId])

    if (!post) return null

    // Get tags for this post
    const tagsSql = `
      SELECT t.name
      FROM post_tags pt
      JOIN tags t ON pt.tag_id = t.id
      WHERE pt.post_id = $1
    `
    const tags = await query<{ name: string }>(tagsSql, [postId])

    // Get like count
    const likesSql = `SELECT COUNT(*) as count FROM post_likes WHERE post_id = $1`
    const likesResult = await queryOne<{ count: string }>(likesSql, [postId])
    const likesCount = Number.parseInt(likesResult?.count || "0")

    // Get comment count
    const commentsSql = `SELECT COUNT(*) as count FROM comments WHERE post_id = $1`
    const commentsResult = await queryOne<{ count: string }>(commentsSql, [postId])
    const commentsCount = Number.parseInt(commentsResult?.count || "0")

    // Check if user has liked the post
    let liked = false
    if (userId) {
      const likedSql = `SELECT 1 FROM post_likes WHERE post_id = $1 AND user_id = $2`
      const likedResult = await queryOne(likedSql, [postId, userId])
      liked = !!likedResult
    }

    // Check if user has saved the post
    let saved = false
    if (userId) {
      const savedSql = `SELECT 1 FROM saved_posts WHERE post_id = $1 AND user_id = $2`
      const savedResult = await queryOne(savedSql, [postId, userId])
      saved = !!savedResult
    }

    // Return the post with additional data
    return {
      ...post,
      tags: tags.map((t) => t.name),
      likes_count: likesCount,
      comments_count: commentsCount,
      liked,
      saved,
    }
  } catch (error) {
    console.error("Error in getPostById:", error)
    return null
  }
}

export async function deletePost(postId: string): Promise<boolean> {
  try {
    // Use a transaction to delete the post and related data
    return await transaction(async (client) => {
      // Delete comments first (due to foreign key constraints)
      await client.query("DELETE FROM comments WHERE post_id = $1", [postId])

      // Delete post likes
      await client.query("DELETE FROM post_likes WHERE post_id = $1", [postId])

      // Delete saved posts
      await client.query("DELETE FROM saved_posts WHERE post_id = $1", [postId])

      // Delete post tags
      await client.query("DELETE FROM post_tags WHERE post_id = $1", [postId])

      // Finally delete the post
      const result = await client.query("DELETE FROM posts WHERE id = $1", [postId])

      return result.rowCount > 0
    })
  } catch (error) {
    console.error("Error deleting post:", error)
    return false
  }
}
import { env } from "./postgres"

// Type definitions
export type PostType = {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
  user_id: string
  username: string
  category_id: number
  category_name: string
  likes: number
  views: number
  tags: string[]
  language: string
  translations?: Record<string, { title: string; content: string }>
}

// Fallback to mock data if database connection fails in development
const MOCK_POSTS: PostType[] = [
  {
    id: 1,
    title: "Getting Started with Study Abroad",
    content: "This is a guide to help you get started with your study abroad journey.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: "1",
    username: "admin",
    category_id: 1,
    category_name: "General",
    likes: 10,
    views: 100,
    tags: ["guide", "getting-started"],
    language: "en",
  },
]

/**
 * Get all posts with pagination
 */
export async function getPostsByLanguage(
  page = 1,
  limit = 10,
  sortBy = "created_at",
  sortOrder = "desc",
  language = "en",
): Promise<PostType[]> {
  try {
    const offset = (page - 1) * limit
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
    `
    return await query<PostType>(sql, [language, limit, offset])
  } catch (error) {
    console.error("Error getting posts:", error)
    // Return mock data in development, throw in production
    if (env.isDevelopment) {
      console.warn("Using mock data for posts")
      return MOCK_POSTS
    }
    throw error
  }
}

export async function getPosts(
  page = 1,
  limit = 10,
  categoryId?: string,
  userId?: string,
): Promise<{ posts: Post[]; total: number }> {
  try {
    const offset = (page - 1) * limit

    // Count total posts
    let countSql = `SELECT COUNT(*) as count FROM posts`
    const countParams = []

    if (categoryId) {
      countSql += ` WHERE category_id = $1`
      countParams.push(categoryId)
    }

    const countResult = await queryOne<{ count: string }>(countSql, countParams)
    const total = Number.parseInt(countResult?.count || "0")

    // Build the query for posts
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
    `

    const params = []

    // Add category filter if provided
    if (categoryId) {
      sql += ` WHERE p.category_id = $1`
      params.push(categoryId)
    }

    // Add order and pagination
    sql += ` ORDER BY p.is_pinned DESC, p.created_at DESC
             LIMIT $${params.length + 1} OFFSET $${params.length + 2}`

    params.push(limit, offset)

    // Get posts
    const posts = await query<Post>(sql, params)

    if (posts.length === 0) {
      return { posts: [], total }
    }

    // Get post IDs for additional queries
    const postIds = posts.map((post) => post.id)

    // Get tags for all posts
    const tagsSql = `
      SELECT pt.post_id, t.name
      FROM post_tags pt
      JOIN tags t ON pt.tag_id = t.id
      WHERE pt.post_id = ANY($1::uuid[])
    `
    const tagsResults = await query<{ post_id: string; name: string }>(tagsSql, [postIds])

    // Group tags by post_id
    const tagsByPostId: Record<string, string[]> = {}
    tagsResults.forEach((tag) => {
      if (!tagsByPostId[tag.post_id]) {
        tagsByPostId[tag.post_id] = []
      }
      tagsByPostId[tag.post_id].push(tag.name)
    })

    // Get like counts for all posts
    const likesSql = `
      SELECT post_id, COUNT(*) as count
      FROM post_likes
      WHERE post_id = ANY($1::uuid[])
      GROUP BY post_id
    `
    const likesResults = await query<{ post_id: string; count: string }>(likesSql, [postIds])

    // Create a map of like counts by post_id
    const likesByPostId: Record<string, number> = {}
    likesResults.forEach((like) => {
      likesByPostId[like.post_id] = Number.parseInt(like.count)
    })

    // Get comment counts for all posts
    const commentsSql = `
      SELECT post_id, COUNT(*) as count
      FROM comments
      WHERE post_id = ANY($1::uuid[])
      GROUP BY post_id
    `
    const commentsResults = await query<{ post_id: string; count: string }>(commentsSql, [postIds])

    // Create a map of comment counts by post_id
    const commentsByPostId: Record<string, number> = {}
    commentsResults.forEach((comment) => {
      commentsByPostId[comment.post_id] = Number.parseInt(comment.count)
    })

    // If userId is provided, check which posts the user has liked and saved
    let likedPostIds: string[] = []
    let savedPostIds: string[] = []

    if (userId) {
      // Get liked posts
      const likedSql = `
        SELECT post_id
        FROM post_likes
        WHERE user_id = $1 AND post_id = ANY($2::uuid[])
      `
      const likedResults = await query<{ post_id: string }>(likedSql, [userId, postIds])
      likedPostIds = likedResults.map((like) => like.post_id)

      // Get saved posts
      const savedSql = `
        SELECT post_id
        FROM saved_posts
        WHERE user_id = $1 AND post_id = ANY($2::uuid[])
      `
      const savedResults = await query<{ post_id: string }>(savedSql, [userId, postIds])
      savedPostIds = savedResults.map((saved) => saved.post_id)
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

    return { posts: enrichedPosts, total }
  } catch (error) {
    console.error("Error in getPosts:", error)
    return { posts: [], total: 0 }
  }
}

export async function getUserPosts(userId: string, page = 1, limit = 10): Promise<{ posts: Post[]; total: number }> {
  try {
    const offset = (page - 1) * limit

    // Count total posts by this user
    const countSql = `SELECT COUNT(*) as count FROM posts WHERE user_id = $1`
    const countResult = await queryOne<{ count: string }>(countSql, [userId])
    const total = Number.parseInt(countResult?.count || "0")

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
    `

    const posts = await query<Post>(sql, [userId, limit, offset])

    if (posts.length === 0) {
      return { posts: [], total }
    }

    // Get post IDs for additional queries
    const postIds = posts.map((post) => post.id)

    // Get tags for all posts
    const tagsSql = `
      SELECT pt.post_id, t.name
      FROM post_tags pt
      JOIN tags t ON pt.tag_id = t.id
      WHERE pt.post_id = ANY($1::uuid[])
    `
    const tagsResults = await query<{ post_id: string; name: string }>(tagsSql, [postIds])

    // Group tags by post_id
    const tagsByPostId: Record<string, string[]> = {}
    tagsResults.forEach((tag) => {
      if (!tagsByPostId[tag.post_id]) {
        tagsByPostId[tag.post_id] = []
      }
      tagsByPostId[tag.post_id].push(tag.name)
    })

    // Get like counts for all posts
    const likesSql = `
      SELECT post_id, COUNT(*) as count
      FROM post_likes
      WHERE post_id = ANY($1::uuid[])
      GROUP BY post_id
    `
    const likesResults = await query<{ post_id: string; count: string }>(likesSql, [postIds])

    // Create a map of like counts by post_id
    const likesByPostId: Record<string, number> = {}
    likesResults.forEach((like) => {
      likesByPostId[like.post_id] = Number.parseInt(like.count)
    })

    // Get comment counts for all posts
    const commentsSql = `
      SELECT post_id, COUNT(*) as count
      FROM comments
      WHERE post_id = ANY($1::uuid[])
      GROUP BY post_id
    `
    const commentsResults = await query<{ post_id: string; count: string }>(commentsSql, [postIds])

    // Create a map of comment counts by post_id
    const commentsByPostId: Record<string, number> = {}
    commentsResults.forEach((comment) => {
      commentsByPostId[comment.post_id] = Number.parseInt(comment.count)
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

    return { posts: enrichedPosts, total }
  } catch (error) {
    console.error("Error in getUserPosts:", error)
    return { posts: [], total: 0 }
  }
}

export async function getSavedPosts(userId: string, page = 1, limit = 10): Promise<{ posts: Post[]; total: number }> {
  try {
    const offset = (page - 1) * limit

    // Count total saved posts
    const countSql = `SELECT COUNT(*) as count FROM saved_posts WHERE user_id = $1`
    const countResult = await queryOne<{ count: string }>(countSql, [userId])
    const total = Number.parseInt(countResult?.count || "0")

    // Get saved post IDs with pagination
    const savedPostsSql = `
      SELECT post_id
      FROM saved_posts
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `
    const savedPosts = await query<{ post_id: string }>(savedPostsSql, [userId, limit, offset])

    if (savedPosts.length === 0) {
      return { posts: [], total }
    }

    const savedPostIds = savedPosts.map((sp) => sp.post_id)

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
    `

    const posts = await query<Post>(sql, [savedPostIds])

    // Get tags for all posts
    const tagsSql = `
      SELECT pt.post_id, t.name
      FROM post_tags pt
      JOIN tags t ON pt.tag_id = t.id
      WHERE pt.post_id = ANY($1::uuid[])
    `
    const tagsResults = await query<{ post_id: string; name: string }>(tagsSql, [savedPostIds])

    // Group tags by post_id
    const tagsByPostId: Record<string, string[]> = {}
    tagsResults.forEach((tag) => {
      if (!tagsByPostId[tag.post_id]) {
        tagsByPostId[tag.post_id] = []
      }
      tagsByPostId[tag.post_id].push(tag.name)
    })

    // Get like counts for all posts
    const likesSql = `
      SELECT post_id, COUNT(*) as count
      FROM post_likes
      WHERE post_id = ANY($1::uuid[])
      GROUP BY post_id
    `
    const likesResults = await query<{ post_id: string; count: string }>(likesSql, [savedPostIds])

    // Create a map of like counts by post_id
    const likesByPostId: Record<string, number> = {}
    likesResults.forEach((like) => {
      likesByPostId[like.post_id] = Number.parseInt(like.count)
    })

    // Get comment counts for all posts
    const commentsSql = `
      SELECT post_id, COUNT(*) as count
      FROM comments
      WHERE post_id = ANY($1::uuid[])
      GROUP BY post_id
    `
    const commentsResults = await query<{ post_id: string; count: string }>(commentsSql, [savedPostIds])

    // Create a map of comment counts by post_id
    const commentsByPostId: Record<string, number> = {}
    commentsResults.forEach((comment) => {
      commentsByPostId[comment.post_id] = Number.parseInt(comment.count)
    })

    // Get liked posts
    const likedSql = `
      SELECT post_id
      FROM post_likes
      WHERE user_id = $1 AND post_id = ANY($2::uuid[])
    `
    const likedResults = await query<{ post_id: string }>(likedSql, [userId, savedPostIds])
    const likedPostIds = likedResults.map((like) => like.post_id)

    // Combine all data
    const enrichedPosts = posts.map((post) => ({
      ...post,
      tags: tagsByPostId[post.id] || [],
      likes_count: likesByPostId[post.id] || 0,
      comments_count: commentsByPostId[post.id] || 0,
      liked: likedPostIds.includes(post.id),
      saved: true, // These are saved posts
    }))

    return { posts: enrichedPosts, total }
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
    const offset = (page - 1) * limit

    // First get the tag ID
    const tagSql = `SELECT id FROM tags WHERE name = $1`
    const tag = await queryOne<{ id: string }>(tagSql, [tagName])

    if (!tag) {
      return { posts: [], total: 0 }
    }

    // Count total posts with this tag
    const countSql = `
      SELECT COUNT(*) as count 
      FROM post_tags 
      WHERE tag_id = $1
    `
    const countResult = await queryOne<{ count: string }>(countSql, [tag.id])
    const total = Number.parseInt(countResult?.count || "0")

    // Get post IDs with this tag
    const postTagsSql = `
      SELECT post_id
      FROM post_tags
      WHERE tag_id = $1
      LIMIT $2 OFFSET $3
    `
    const postTags = await query<{ post_id: string }>(postTagsSql, [tag.id, limit, offset])

    if (postTags.length === 0) {
      return { posts: [], total }
    }

    const postIds = postTags.map((pt) => pt.post_id)

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
    `

    const posts = await query<Post>(sql, [postIds])

    // Get tags for all posts
    const tagsSql = `
      SELECT pt.post_id, t.name
      FROM post_tags pt
      JOIN tags t ON pt.tag_id = t.id
      WHERE pt.post_id = ANY($1::uuid[])
    `
    const tagsResults = await query<{ post_id: string; name: string }>(tagsSql, [postIds])

    // Group tags by post_id
    const tagsByPostId: Record<string, string[]> = {}
    tagsResults.forEach((tag) => {
      if (!tagsByPostId[tag.post_id]) {
        tagsByPostId[tag.post_id] = []
      }
      tagsByPostId[tag.post_id].push(tag.name)
    })

    // Get like counts for all posts
    const likesSql = `
      SELECT post_id, COUNT(*) as count
      FROM post_likes
      WHERE post_id = ANY($1::uuid[])
      GROUP BY post_id
    `
    const likesResults = await query<{ post_id: string; count: string }>(likesSql, [postIds])

    // Create a map of like counts by post_id
    const likesByPostId: Record<string, number> = {}
    likesResults.forEach((like) => {
      likesByPostId[like.post_id] = Number.parseInt(like.count)
    })

    // Get comment counts for all posts
    const commentsSql = `
      SELECT post_id, COUNT(*) as count
      FROM comments
      WHERE post_id = ANY($1::uuid[])
      GROUP BY post_id
    `
    const commentsResults = await query<{ post_id: string; count: string }>(commentsSql, [postIds])

    // Create a map of comment counts by post_id
    const commentsByPostId: Record<string, number> = {}
    commentsResults.forEach((comment) => {
      commentsByPostId[comment.post_id] = Number.parseInt(comment.count)
    })

    // If userId is provided, check which posts the user has liked and saved
    let likedPostIds: string[] = []
    let savedPostIds: string[] = []

    if (userId) {
      // Get liked posts
      const likedSql = `
        SELECT post_id
        FROM post_likes
        WHERE user_id = $1 AND post_id = ANY($2::uuid[])
      `
      const likedResults = await query<{ post_id: string }>(likedSql, [userId, postIds])
      likedPostIds = likedResults.map((like) => like.post_id)

      // Get saved posts
      const savedSql = `
        SELECT post_id
        FROM saved_posts
        WHERE user_id = $1 AND post_id = ANY($2::uuid[])
      `
      const savedResults = await query<{ post_id: string }>(savedSql, [userId, postIds])
      savedPostIds = savedResults.map((saved) => saved.post_id)
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

    return { posts: enrichedPosts, total }
  } catch (error) {
    console.error("Error in getPostsByTag:", error)
    return { posts: [], total: 0 }
  }
}
