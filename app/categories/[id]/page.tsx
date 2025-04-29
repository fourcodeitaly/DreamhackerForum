import { Suspense } from "react";
import { PostList } from "@/components/post-list";
import { SortFilter } from "@/components/sort-filter";
import { CategorySidebar } from "@/components/category-sidebar";
import { SearchBar } from "@/components/search-bar";
import { PostListSkeleton } from "@/components/skeletons";
import { getCategory } from "@/lib/data-utils";
import { getPosts } from "@/lib/data-utils";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryId = params.id;
  const category = await getCategory(categoryId);
  const initialPosts = await getPosts(1, 10, categoryId);

  const categoryName = category?.name?.en || categoryId;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4 lg:w-1/5">
          <CategorySidebar activeCategoryId={categoryId} />
        </div>
        <div className="md:w-3/4 lg:w-4/5">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h1 className="text-3xl font-bold">{categoryName}</h1>
            <SearchBar />
          </div>
          <div className="mb-6">
            <SortFilter />
          </div>
          <Suspense fallback={<PostListSkeleton />}>
            <PostList initialPosts={initialPosts} categoryId={categoryId} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
