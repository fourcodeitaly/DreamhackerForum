import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PostDetail } from "@/components/post-detail"
import { CommentSection } from "@/components/comment-section"
import { RelatedPosts } from "@/components/related-posts"
import { BackButton } from "@/components/back-button"
import { Skeleton } from "@/components/ui/skeleton"
import { getPostById, getCommentsByPostId, getRelatedPosts } from "@/lib/data-utils"
import { hasSupabaseCredentials } from "@/lib/supabase"

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    // Check if we have Supabase credentials
    const hasCredentials = hasSupabaseCredentials()

    if (!hasCredentials) {
      console.warn("Supabase credentials not available, using mock data fallback")
    }

    // Get the post using the data-utils function which has its own error handling
    const post = await getPostById(params.id)

    if (!post) {
      console.error("Post not found:", params.id)
      notFound()
    }

    // Get comments for this post
    const comments = await getCommentsByPostId(params.id)

    // Get related posts
    const relatedPosts = await getRelatedPosts(params.id, post.category_id)

    return (
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <PostDetail post={post} />

        <div className="mt-8">
          <CommentSection postId={params.id} initialComments={comments} />
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
