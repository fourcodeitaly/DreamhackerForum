"use server"

import { queryOne, transaction } from "../postgres"

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

      if (result.rowCount) {
        return true
      }

      return false
    })
  } catch (error) {
    console.error("Error deleting post:", error)
    return false
  }
}

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
