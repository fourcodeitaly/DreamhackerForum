import { createServerSupabaseClient } from "../supabase/server";
import type { User } from "./users";

export type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  parent_id?: string;
  content: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  author?: User;
  likes_count?: number;
  liked?: boolean;
};

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    console.error("Supabase client not available");
    return [];
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    return [];
  }

  // Get additional data for each comment
  const commentsWithDetails = await Promise.all(
    data.map(async (comment) => {
      // Get comment author
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", comment.user_id)
        .single();

      // Get likes count
      const { count: likesCount } = await supabase
        .from("comment_likes")
        .select("*", { count: "exact", head: true })
        .eq("comment_id", comment.id);

      return {
        ...comment,
        author: userData,
        likes_count: likesCount || 0,
        liked: false, // This will be set client-side based on the current user
      };
    })
  );

  return commentsWithDetails as Comment[];
}

export async function createComment(
  commentData: Omit<Comment, "id" | "created_at" | "updated_at">
): Promise<Comment | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    console.error("Supabase client not available");
    return null;
  }

  const { data, error } = await supabase
    .from("comments")
    .insert([commentData])
    .select()
    .single();

  if (error) {
    console.error("Error creating comment:", error);
    return null;
  }

  // Get comment author
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user_id)
    .single();

  return {
    ...data,
    author: userData,
    likes_count: 0,
    liked: false,
  } as Comment;
}
