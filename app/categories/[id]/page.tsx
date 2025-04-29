import { PostList } from "@/components/post-list"
import { SortFilter } from "@/components/sort-filter"
import { CategorySidebar } from "@/components/category-sidebar"
import { SearchBar } from "@/components/search-bar"
import { Suspense } from "react"
import { PostListSkeleton } from "@/components/skeletons"
import { getMockPostsByCategory } from "@/lib/mock-data"

export default function CategoryPage({ params }: { params: { id: string } }) {
  const categoryId = params.id
  const posts = getMockPostsByCategory(categoryId)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4 lg:w-1/5">
          <CategorySidebar />
        </div>
        <div className="md:w-3/4 lg:w-4/5">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h1 className="text-3xl font-bold">Category: {categoryId.replace(/-/g, " ")}</h1>
            <SearchBar />
          </div>
          <div className="mb-6">
            <SortFilter />
          </div>
          <Suspense fallback={<PostListSkeleton />}>
            <PostList initialPosts={posts} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
