import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PostDetail } from "@/components/post-detail"
import { CommentSection } from "@/components/comment-section"
import { RelatedPosts } from "@/components/related-posts"
import { BackButton } from "@/components/back-button"
import { Skeleton } from "@/components/ui/skeleton"
import { createServerSupabaseClient } from "@/lib/supabase"

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    // Create server-specific Supabase client
    const supabase = createServerSupabaseClient()

    if (!supabase) {
      throw new Error("Failed to create Supabase client")
    }

    // Fetch post data on the server
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select(`
        *,
        user:user_id (id, name, username, image_url),
        category:category_id (id, name)
      `)
      .eq("id", params.id)
      .single()

    if (postError || !post) {
      console.error("Error fetching post:", postError)
      notFound()
    }

    // Fetch comments
    const { data: comments = [] } = await supabase
      .from("comments")
      .select(`
        *,
        user:user_id(id, name, username, image_url)
      `)
      .eq("post_id", params.id)
      .order("created_at", { ascending: false })

    // Add likes count to comments
    const commentsWithLikes = await Promise.all(
      comments.map(async (comment) => {
        try {
          const { count } = await supabase
            .from("comment_likes")
            .select("*", { count: "exact", head: true })
            .eq("comment_id", comment.id)

          return {
            ...comment,
            likesCount: count || 0,
            liked: false, // Default to false, will be updated on client if user is logged in
          }
        } catch (error) {
          console.error("Error fetching comment likes:", error)
          return {
            ...comment,
            likesCount: 0,
            liked: false,
          }
        }
      }),
    )

    // Fetch related posts
    let relatedPosts = []
    if (post.category_id) {
      const { data: relatedPostsData = [] } = await supabase
        .from("posts")
        .select("*")
        .eq("category_id", post.category_id)
        .neq("id", post.id)
        .limit(3)

      relatedPosts = relatedPostsData
    }

    return (
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <PostDetail post={post} />

        <div className="mt-8">
          <CommentSection postId={params.id} initialComments={commentsWithLikes} />
        </div>

        <div className="mt-12">
          <Suspense fallback={<Skeleton className="h-48" />}>
            <RelatedPosts currentPostId={post.id} categoryId={post.category_id} initialPosts={relatedPosts} />
          </Suspense>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in PostPage:", error)

    // Return a simple error UI
    return (
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <div className="p-6 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Post</h2>
          <p className="text-red-700 dark:text-red-300">
            We encountered an error while loading this post. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}
