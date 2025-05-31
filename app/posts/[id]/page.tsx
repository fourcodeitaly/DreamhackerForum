import { Suspense, use } from "react";
import { notFound } from "next/navigation";
import { PostDetail } from "@/components/post/post-detail";
import { RelatedPosts } from "@/components/post/related-posts";
import { BackButton } from "@/components/layout/back-button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getPinnedPosts,
  getPostById,
  getRelatedPosts,
} from "@/lib/db/posts/post-get";
import { CommentSection } from "@/components/comments/comment-section";
import { PostsSidebar } from "@/components/layout/posts-sidebar";
import { TopContributors } from "@/components/user/top-contributors";
import { getTopContributors } from "@/lib/db/users/users-get";
import { FeaturedPosts } from "@/components/post/featured-posts";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { QuickSchoolsView } from "@/components/school/quick-schools-view";
import { getSchoolByNationOrderByRank } from "@/lib/db/schools/school-get";

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const { id } = await params;
    const user = await getServerSession(authOptions);

    // Get the post, related posts, and top contributors
    const [post, relatedPosts, topContributors, featuredPosts, schools] =
      await Promise.all([
        getPostById(id, user?.user?.id),
        getRelatedPosts(id),
        getTopContributors(),
        getPinnedPosts(),
        getSchoolByNationOrderByRank({
          nationCode: "all",
          limit: 5,
          offset: 0,
        }),
      ]);

    if (!post) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 md:py-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Sticky */}
          <div className="hidden lg:block lg:w-1/5">
            <div className="sticky top-20">
              <PostsSidebar />
            </div>
          </div>

          {/* Main content */}
          <div className="lg:w-3/5">
            <Suspense fallback={<Skeleton className="h-48" />}>
              <PostDetail post={post} />
            </Suspense>

            <div className="mt-8">
              <Suspense fallback={<Skeleton className="h-48" />}>
                <CommentSection
                  postId={id}
                  commentsCount={post.comments_count || 0}
                />
              </Suspense>
            </div>
            <div className="lg:hidden mt-12">
              <PostsSidebar />
            </div>

            <div className="mt-12">
              <Suspense fallback={<Skeleton className="h-48" />}>
                <RelatedPosts posts={relatedPosts} />
              </Suspense>
            </div>
          </div>

          {/* Right sidebar - Sticky */}
          <div className="lg:w-1/5">
            <div className="sticky top-20 space-y-6 hidden md:block">
              <FeaturedPosts initialPosts={featuredPosts} />
              <TopContributors initialTopContributors={topContributors} />
              <QuickSchoolsView initialSchools={schools} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in PostPage:", error);

    return (
      <div className="container mx-auto px-4 py-8">
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
