import { PostList } from "@/components/post-list"
import { SortFilter } from "@/components/sort-filter"
import { CategorySidebar } from "@/components/category-sidebar"
import { SearchBar } from "@/components/search-bar"
import { FeaturedPosts } from "@/components/featured-posts"
import { Suspense } from "react"
import { PostListSkeleton } from "@/components/skeletons"
import { EnvChecker } from "@/components/env-checker"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Only show in development */}
      {process.env.NODE_ENV === "development" && <EnvChecker />}

      <div className="mb-8">
        <FeaturedPosts />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4 lg:w-1/5">
          <CategorySidebar />
        </div>
        <div className="md:w-3/4 lg:w-4/5">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h1 className="text-3xl font-bold">Recent Discussions</h1>
            <SearchBar />
          </div>
          <div className="mb-6">
            <SortFilter />
          </div>
          <Suspense fallback={<PostListSkeleton />}>
            <PostList />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
