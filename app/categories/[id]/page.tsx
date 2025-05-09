import { Suspense } from "react";
import { PostList } from "@/components/post/post-list";
import { SortFilter } from "@/components/sort-filter";
import { BackButton } from "@/components/layout/back-button";
import { PostListSkeleton } from "@/components/layout/skeletons";
import {
  getCategory,
  getPostsByCategory,
} from "@/lib/db/category/category-get";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: { id: string };
  searchParams: { page?: string };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { id } = await params;
  const sParams = await searchParams;
  const page = sParams.page ? Number.parseInt(sParams.page) : 1;
  const postsPerPage = 10;

  // Fetch category and posts
  const category = await getCategory(id);
  const { posts, total } = await getPostsByCategory(id, page, postsPerPage);

  const categoryName = category?.name?.en || "Category";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <BackButton />
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-3xl font-bold">{categoryName}</h1>
      </div>
      <div className="mb-6">
        <SortFilter />
      </div>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList
          posts={posts}
          totalPosts={total}
          currentPage={page}
          pathname={`/categories/${id}`}
        />
      </Suspense>
    </div>
  );
}
