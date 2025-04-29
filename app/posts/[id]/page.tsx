import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PostDetail } from "@/components/post-detail";
import { CommentSection } from "@/components/comment-section";
import { RelatedPosts } from "@/components/related-posts";
import { BackButton } from "@/components/back-button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPostById } from "@/lib/data-utils";
import { createServerSupabaseClient } from "@/lib/supabase";

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    // Ensure params is resolved before using
    const { id } = await params;
    // Get the post first
    const post = await getPostById(id);

    if (!post) {
      notFound();
    }

    // Create Supabase client
    const supabase = createServerSupabaseClient();

    // Initialize with empty arrays in case Supabase client is null
    let comments = [];
    let relatedPosts = [];

    // Only try to fetch comments and related posts if Supabase client exists
    if (supabase) {
      // Fetch comments
      const { data: commentsData = [] } = await supabase
        .from("comments")
        .select(
          `
          *,
          user:user_id(id, name, username, image_url)
        `
        )
        .eq("post_id", id)
        .order("created_at", { ascending: false });

      comments = commentsData || [];

      // Fetch related posts if we have a category ID
      if (post.category_id) {
        const { data: relatedPostsData = [] } = await supabase
          .from("posts")
          .select("*")
          .eq("category_id", post.category_id)
          .neq("id", post.id)
          .limit(3);

        relatedPosts = relatedPostsData || [];
      }

      // Add likes count to comments
      comments = await Promise.all(
        comments.map(async (comment) => {
          try {
            const { count } = await supabase
              .from("comment_likes")
              .select("*", { count: "exact", head: true })
              .eq("comment_id", comment.id);

            return {
              ...comment,
              likesCount: count || 0,
              liked: false, // Default to false, will be updated on client if user is logged in
            };
          } catch (error) {
            console.error("Error fetching comment likes:", error);
            return {
              ...comment,
              likesCount: 0,
              liked: false,
            };
          }
        })
      );
    } else {
      console.error("Failed to create Supabase client in PostPage");
    }

    // Ensure we have valid values for the RelatedPosts component
    const validPostId = post.id || id;
    const validCategoryId = post.category_id || null;

    return (
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <PostDetail post={post} />

        <div className="mt-8">
          <CommentSection postId={id} initialComments={comments} />
        </div>

        <div className="mt-12">
          <Suspense fallback={<Skeleton className="h-48" />}>
            <RelatedPosts
              currentPostId={validPostId}
              categoryId={validCategoryId}
              initialPosts={relatedPosts}
            />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in PostPage:", error);

    // Return a simple error UI
    return (
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="p-6 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">
            Error Loading Post
          </h2>
          <p className="text-red-700 dark:text-red-300">
            We encountered an error while loading this post. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }
}
