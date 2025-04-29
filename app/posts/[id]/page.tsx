import { PostDetail } from "@/components/post-detail"
import { CommentSection } from "@/components/comment-section"
import { RelatedPosts } from "@/components/related-posts"
import { BackButton } from "@/components/back-button"
import { getPostById } from "@/lib/data-utils"
import { notFound } from "next/navigation"

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <BackButton />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <PostDetail post={post} />
          <CommentSection postId={params.id} />
        </div>
        <div className="lg:w-1/4">
          <RelatedPosts currentPostId={params.id} />
        </div>
      </div>
    </div>
  )
}
