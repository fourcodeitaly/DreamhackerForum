"use server";

import { createPost, updatePost } from "@/lib/db/posts/posts-modify";
import type { MultilingualContent, Post } from "@/lib/db/posts/posts-modify";
import { revalidatePath } from "next/cache";
import { query, queryOne } from "@/lib/db/postgres";
import { localAuth } from "@/lib/auth/local-auth";
import { notifyFollowersNewPost } from "@/lib/db/notification";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export async function createPostAction(formData: {
  userId: string;
  title: MultilingualContent;
  content: MultilingualContent;
  categoryId?: string;
  tags?: string[];
  imageUrl?: string;
  eventId?: string;
  isPinned?: boolean;
}): Promise<{ success: boolean; post?: Post; message?: string }> {
  try {
    const user = await getServerSession(authOptions);

    if (!user) {
      return { success: false, message: "User not found" };
    }
    // Create post in the database
    const post = await createPost({
      user_id: formData.userId,
      title: formData.title,
      content: formData.content,
      category_id: formData.categoryId,
      tags: formData.tags,
      image_url: formData.imageUrl,
      event_id: formData.eventId || null,
      is_pinned: formData.isPinned || false,
    });

    if (!post) {
      return { success: false, message: "Failed to create post" };
    }

    // Create notifications for followers
    await notifyFollowersNewPost(
      post.id,
      formData.userId,
      `${user.user?.name} has created a new post`
    );

    revalidatePath("/");
    revalidatePath(`/posts/${post.id}`);

    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    return {
      success: false,
      message: "An error occurred while creating the post",
    };
  }
}

export async function updatePostAction(
  postId: string,
  formData: {
    title?: MultilingualContent;
    content?: MultilingualContent;
    categoryId?: string;
    tags?: string[];
    imageUrl?: string | null;
    eventId?: string | null;
    isPinned?: boolean;
  }
) {
  try {
    // Update post in the database
    const post = await updatePost(postId, {
      title: formData.title,
      content: formData.content,
      category_id: formData.categoryId,
      tags: formData.tags,
      image_url: formData.imageUrl || undefined,
      event_id: formData.eventId || null,
      is_pinned: formData.isPinned,
    });

    if (!post) {
      return { success: false, message: "Failed to update post" };
    }

    revalidatePath("/");
    revalidatePath(`/posts/${post.id}`);

    return { success: true, post };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      success: false,
      message: "An error occurred while updating the post",
    };
  }
}

export async function likePostAction(postId: string, userId: string) {
  // Check if local auth is enabled
  if (localAuth.isEnabled()) {
    // For local development, simulate like functionality
    return { success: true, liked: true };
  }

  try {
    // Check if already liked
    const existingLike = await queryOne(
      "SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2",
      [postId, userId]
    );

    if (existingLike) {
      // Unlike
      await query(
        "DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2",
        [postId, userId]
      );

      revalidatePath(`/posts/${postId}`);
      return { success: true, liked: false };
    } else {
      // Like
      await query("INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)", [
        postId,
        userId,
      ]);

      revalidatePath(`/posts/${postId}`);
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Error toggling post like:", error);
    return { success: false, message: "An error occurred" };
  }
}

export async function savePostAction(postId: string, userId: string) {
  // Check if local auth is enabled
  if (localAuth.isEnabled()) {
    // For local development, simulate save functionality
    return { success: true, saved: true };
  }

  try {
    // Check if already saved
    const existingSave = await queryOne(
      "SELECT * FROM saved_posts WHERE post_id = $1 AND user_id = $2",
      [postId, userId]
    );

    if (existingSave) {
      // Unsave
      await query(
        "DELETE FROM saved_posts WHERE post_id = $1 AND user_id = $2",
        [postId, userId]
      );

      return { success: true, saved: false };
    } else {
      // Save
      await query(
        "INSERT INTO saved_posts (post_id, user_id) VALUES ($1, $2)",
        [postId, userId]
      );

      return { success: true, saved: true };
    }
  } catch (error) {
    console.error("Error toggling saved post:", error);
    return { success: false, message: "An error occurred" };
  }
}
