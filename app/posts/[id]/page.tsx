import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PostDetail } from "@/components/post/post-detail";
import { RelatedPosts } from "@/components/post/related-posts";
import { BackButton } from "@/components/layout/back-button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPostById, getRelatedPosts } from "@/lib/db/posts/post-get";
import { CommentSection } from "@/components/comments/comment-section";

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const { id } = await params;

    // Get the post and related posts
    const [post, relatedPosts] = await Promise.all([
      getPostById(id),
      getRelatedPosts(id),
    ]);

    if (!post) {
      notFound();
    }

    return (
      <div className="container max-w-4xl py-4 md:py-8">
        {/* <div className="mb-6">
          <BackButton />
        </div> */}

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
    );
  } catch (error) {
    console.error("Error in PostPage:", error);

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
