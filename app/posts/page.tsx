import { PostList } from "@/components/post/post-list";
import { SortFilter } from "@/components/sort-filter";
import { SearchBar } from "@/components/layout/search-bar";
import { FeaturedPosts } from "@/components/post/featured-posts";
import { TopContributors } from "@/components/user/top-contributors";
import { PostsSidebar } from "@/components/layout/posts-sidebar";
import { Suspense } from "react";
import { PostListSkeleton } from "@/components/layout/skeletons";
import { ServerEnvChecker } from "@/components/layout/server-env-checker";
import type { Post } from "@/lib/db/posts/posts-modify";
import {
  getNullTitlePosts,
  getPinnedPosts,
  getPosts,
} from "@/lib/db/posts/post-get";
import { type Contributor, getTopContributors } from "@/lib/db/users-get";
import { getCategory } from "@/lib/db/category/category-get";

export const dynamic = "force-dynamic";

export default async function Posts({
  searchParams,
}: {
  searchParams: { page?: string; nullPosts?: string; category?: string };
}) {
  // Get current page from query parameters
  const { page, nullPosts, category } = await searchParams;
  const pageNumber = page ? Number.parseInt(page) : 1;
  const categoryId = category !== "undefined" ? category : undefined;
  const postsPerPage = 10;

  // Fetch category if categoryId is provided
  const categoryData = categoryId ? await getCategory(categoryId) : null;
  const categoryName = categoryData?.name?.en || "All Posts";

  // Fetch posts based on whether we're looking for null titles or not
  const result = nullPosts
    ? await getNullTitlePosts(pageNumber, postsPerPage)
    : await getPosts(pageNumber, postsPerPage, false, categoryId);

  const initialPosts = result.posts ?? [];
  const totalPosts = result.total;

  // Fetch featured posts
  const featuredPosts = await getPinnedPosts();

  // Fetch top contributors (category-specific if category is provided)
  const topContributors = await getTopContributors();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Only show in development */}
      {process.env.NODE_ENV === "development" && <ServerEnvChecker />}

      <div className="mb-8">
        <FeaturedPosts posts={featuredPosts} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Sticky */}
        <div className="lg:w-1/4">
          <div className="sticky top-20">
            <PostsSidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:w-2/4">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h1 className="text-3xl font-bold">
              {categoryId ? categoryName : "All Categories"}
            </h1>
            {/* <SearchBar /> */}
          </div>
          <div className="mb-6">
            <SortFilter />
          </div>
          <div className="flex flex-col gap-4">
            <Suspense fallback={<PostListSkeleton />}>
              <PostList
                posts={initialPosts}
                totalPosts={totalPosts}
                currentPage={pageNumber}
                pathname={`/posts?category=${categoryId}`}
              />
            </Suspense>
          </div>
        </div>

        {/* Right sidebar - Sticky */}
        <div className="lg:w-1/4">
          <div className="sticky top-20">
            <TopContributors topContributors={topContributors} />
          </div>
        </div>
      </div>
    </div>
  );
}
