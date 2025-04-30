import { Suspense } from "react"
import { notFound } from "next/navigation"
import { PostDetail } from "@/components/post-detail"
import { CommentSection } from "@/components/comments/comment-section"
import { RelatedPosts } from "@/components/related-posts"
import { BackButton } from "@/components/back-button"
import { Skeleton } from "@/components/ui/skeleton"
import { getPostById } from "@/lib/data-utils-supabase"
import { createServerSupabaseClient } from "@/lib/supabase/server"

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    // Get the post first
    const { id } = await params

    const post = await getPostById(id)

    if (!post) {
      notFound()
    }

    // Create Supabase client
    const supabase = await createServerSupabaseClient()

    // Initialize with empty arrays in case Supabase client is null
    let relatedPosts: any[] = []

    // Only try to fetch related posts if Supabase client exists
    if (supabase) {
      // Enhanced related posts fetching
      if (post.category_id) {
        // First try to get posts from the same category
        const { data: categoryRelatedPosts = [] } = await supabase
          .from("posts")
          .select(
            `
            *,
            user:user_id (id, name, username, image_url),
            category:category_id (id, name)
          `,
          )
          .eq("category_id", post.category_id)
          .neq("id", post.id)
          .limit(3)

        relatedPosts = categoryRelatedPosts || []

        // If we don't have enough posts from the same category, fetch some recent posts
        if (relatedPosts.length < 3) {
          const neededPosts = 3 - relatedPosts.length
          const existingIds = [post.id, ...relatedPosts.map((p) => p.id)]

          const { data: recentPosts = [] } = await supabase
            .from("posts")
            .select(
              `
              *,
              user:user_id (id, name, username, image_url),
              category:category_id (id, name)
            `,
            )
            .not("id", "in", `(${existingIds.join(",")})`)
            .order("created_at", { ascending: false })
            .limit(neededPosts)

          relatedPosts = [...relatedPosts, ...(recentPosts || [])]
        }
      } else {
        // If no category, just get recent posts
        const { data: recentPosts = [] } = await supabase
          .from("posts")
          .select(
            `
            *,
            user:user_id (id, name, username, image_url),
            category:category_id (id, name)
          `,
          )
          .neq("id", post.id)
          .order("created_at", { ascending: false })
          .limit(3)

        relatedPosts = recentPosts || []
      }
    } else {
      console.error("Failed to create Supabase client in PostPage")
    }

    return (
      <div className="container max-w-4xl py-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <Suspense fallback={<Skeleton className="h-48" />}>
          <PostDetail post={post} />
        </Suspense>

        <div className="mt-8">
          <Suspense fallback={<Skeleton className="h-48" />}>
            <CommentSection postId={id} />
          </Suspense>
        </div>

        <div className="mt-12">
          <Suspense fallback={<Skeleton className="h-48" />}>
            <RelatedPosts posts={relatedPosts} />
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
