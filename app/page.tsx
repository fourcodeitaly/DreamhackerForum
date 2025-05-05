import { PostList } from "@/components/post-list"
import { SortFilter } from "@/components/sort-filter"
import { CategorySidebar } from "@/components/category-sidebar"
import { SearchBar } from "@/components/search-bar"
import { FeaturedPosts } from "@/components/featured-posts"
import { TopContributors } from "@/components/top-contributors"
import { Suspense } from "react"
import { PostListSkeleton } from "@/components/skeletons"
import { ServerEnvChecker } from "@/components/server-env-checker"
import { getPosts, getPostCount } from "@/lib/data-utils-supabase"
import type { Post } from "@/lib/db/posts"

export const dynamic = "force-dynamic"

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  // Get current page from query parameters
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const postsPerPage = 10

  // Fetch posts on the server
  let initialPosts: Post[] = []
  let totalPosts = 0

  try {
    initialPosts = await getPosts(page, postsPerPage)
    totalPosts = await getPostCount()
  } catch (error) {
    console.error("Error fetching posts in Home page:", error)
    // Continue with empty posts array
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Only show in development */}
      {process.env.NODE_ENV === "development" && <ServerEnvChecker />}

      <div className="mb-8">
        <FeaturedPosts />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left sidebar */}
        <div className="lg:w-1/5">
          <CategorySidebar />
        </div>

        {/* Main content */}
        <div className="lg:w-3/5">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h1 className="text-3xl font-bold">Recent Discussions</h1>
            <SearchBar />
          </div>
          <div className="mb-6">
            <SortFilter />
          </div>
          <Suspense fallback={<PostListSkeleton />}>
            <PostList initialPosts={initialPosts} totalPosts={totalPosts} currentPage={page} />
          </Suspense>
        </div>

        {/* Right sidebar */}
        <div className="lg:w-1/5">
          <TopContributors />
        </div>
      </div>
    </div>
  )
}
