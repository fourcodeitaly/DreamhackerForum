"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { createPost, updatePost } from "@/lib/db/posts"
import type { MultilingualContent } from "@/lib/db/posts"
import { revalidatePath } from "next/cache"

export async function createPostAction(formData: {
  userId: string
  title: MultilingualContent
  content: MultilingualContent
  categoryId?: string
  tags?: string[]
  imageUrl?: string
  isPinned?: boolean
}) {
  try {
    const post = await createPost({
      user_id: formData.userId,
      title: formData.title,
      content: formData.content,
      category_id: formData.categoryId,
      tags: formData.tags,
      image_url: formData.imageUrl,
      is_pinned: formData.isPinned || false,
    })

    if (!post) {
      return { success: false, message: "Failed to create post" }
    }

    revalidatePath("/")
    revalidatePath(`/posts/${post.id}`)

    return { success: true, post }
  } catch (error) {
    console.error("Error creating post:", error)
    return { success: false, message: "An error occurred while creating the post" }
  }
}

export async function updatePostAction(
  postId: string,
  formData: {
    title?: MultilingualContent
    content?: MultilingualContent
    categoryId?: string
    tags?: string[]
    imageUrl?: string
    isPinned?: boolean
  },
) {
  try {
    const post = await updatePost(postId, {
      title: formData.title,
      content: formData.content,
      category_id: formData.categoryId,
      tags: formData.tags,
      image_url: formData.imageUrl,
      is_pinned: formData.isPinned,
    })

    if (!post) {
      return { success: false, message: "Failed to update post" }
    }

    revalidatePath("/")
    revalidatePath(`/posts/${post.id}`)

    return { success: true, post }
  } catch (error) {
    console.error("Error updating post:", error)
    return { success: false, message: "An error occurred while updating the post" }
  }
}

export async function likePostAction(postId: string, userId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single()

    if (existingLike) {
      // Unlike
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", userId)

      revalidatePath(`/posts/${postId}`)
      return { success: true, liked: false }
    } else {
      // Like
      await supabase.from("post_likes").insert([{ post_id: postId, user_id: userId }])

      revalidatePath(`/posts/${postId}`)
      return { success: true, liked: true }
    }
  } catch (error) {
    console.error("Error toggling post like:", error)
    return { success: false, message: "An error occurred" }
  }
}

export async function savePostAction(postId: string, userId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Check if already saved
    const { data: existingSave } = await supabase
      .from("saved_posts")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single()

    if (existingSave) {
      // Unsave
      await supabase.from("saved_posts").delete().eq("post_id", postId).eq("user_id", userId)

      return { success: true, saved: false }
    } else {
      // Save
      await supabase.from("saved_posts").insert([{ post_id: postId, user_id: userId }])

      return { success: true, saved: true }
    }
  } catch (error) {
    console.error("Error toggling saved post:", error)
    return { success: false, message: "An error occurred" }
  }
}
