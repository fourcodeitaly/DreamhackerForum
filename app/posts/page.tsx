import { PostList } from "@/components/post/post-list";
import { SortFilter } from "@/components/sort-filter";
import { FeaturedPosts } from "@/components/post/featured-posts";
import { TopContributors } from "@/components/user/top-contributors";
import { PostsSidebar } from "@/components/layout/posts-sidebar";
import { RunningCat } from "@/components/ui/running-cat";
import { Suspense } from "react";
import { PostListSkeleton } from "@/components/layout/skeletons";
import { ServerEnvChecker } from "@/components/layout/server-env-checker";
import {
  getNullTitlePosts,
  getPinnedPosts,
  getPosts,
  getPostsByTags,
} from "@/lib/db/posts/post-get";
import { getTopContributors } from "@/lib/db/users-get";
import { getCategory } from "@/lib/db/category/category-get";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerUser } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";

const categories: { id: string; name: string }[] = [
  { id: "4b1a14a4-a5a9-46af-968f-2d1d75f470e5", name: "China" },
  { id: "65df2188-2c7a-43e0-affc-bf0d4ac924f5", name: "United Kingdom" },
  { id: "75d74626-55fe-47be-bc03-7e6531d19249", name: "United States" },
  { id: "83f2e16c-5c5d-459f-ab3d-301efefa78ad", name: "Singapore" },
  { id: "40e5e7f7-fc8c-4e17-9297-02e4c04623f4", name: "Australia" },
  { id: "705da86e-4ea8-4d96-a33d-16b8d4d4bf8f", name: "Germany" },
  { id: "3a3b7c21-9f07-40bb-944b-b72fe89ef8c9", name: "France" },
  { id: "7b98881d-f4de-40f6-81e0-4ec9e7f4dff4", name: "Netherlands" },
  { id: "e4e9fb41-5a05-470c-925b-f91b1a00d962", name: "Canada" },
  { id: "a6af4a21-67dd-40da-80ba-8eaa924a2ed4", name: "Belgium" },
  { id: "4c9579a3-8ac8-43bb-8fbb-32280ba0bb91", name: "Spain" },
  { id: "379ec624-0d31-4026-aa48-38396f542fe5", name: "Hong Kong" },
  { id: "d87db404-09f1-4f92-ada4-16e8baa73856", name: "Japan" },
  { id: "8c589bbf-0cce-4d26-a28c-d17c8942155e", name: "Sweden" },
  { id: "43428091-acb5-478d-b351-975725896454", name: "Switzerland" },
  { id: "4edebb77-56a0-451e-92cb-5c3cda094349", name: "Italy" },
  { id: "7dfd9d67-62d8-4ac7-8e87-77be4d3c2578", name: "Israel" },
  { id: "38cce86f-9566-4672-97a8-892cb30242eb", name: "South Korea" },
  { id: "1160cfeb-35fd-4ad0-b03e-5b35a6d32d22", name: "Denmark" },
  { id: "9a5bb1e8-c7f8-49ee-af34-fbdf53d5b4f2", name: "Norway" },
  { id: "442e3a3f-75db-4a0e-8ec2-6a161c00e2b9", name: "Finland" },
  { id: "ef5fe957-7903-4629-8f2b-a7035d4dc8b7", name: "Hungary" },
  { id: "f38ab0c6-88ee-4587-bfe7-2eee9585b1ca", name: "Ireland" },
  { id: "6e1f2209-e06b-40f4-8bf5-ea6ebeabdfb1", name: "India" },
  { id: "d14583f2-da16-4c10-9b26-08107149a674", name: "Portugal" },
  { id: "9816ef27-5053-4f59-9270-773a3d0a0a86", name: "Taiwan" },
  { id: "60bd2f8f-6247-4e45-8c6a-6bd04a338da9", name: "Slovenia" },
  { id: "0d324926-ba70-48f1-bc71-9d543766e6af", name: "Brazil" },
  { id: "00fe2122-5f5d-4efa-a89b-acedb226d7eb", name: "South Africa" },
  { id: "7b9e1376-b384-4e8b-8525-e4d49c2c8dee", name: "Mexico" },
  { id: "bdae80b7-22fc-4b1d-9867-ef465ec61058", name: "Africa" },
  { id: "c34d416e-1bed-4474-a020-e83032e2b15d", name: "Scholarship" },
];

export default async function Posts({
  searchParams,
}: {
  searchParams: {
    page?: string;
    nullPosts?: string;
    category?: string;
    tag?: string;
  };
}) {
  // Get current page from query parameters
  const { page, nullPosts, category, tag } = await searchParams;
  const pageNumber = page ? Number.parseInt(page) : 1;
  const categoryId = category !== "undefined" ? category : undefined;
  const postsPerPage = 10;

  // Fetch category if categoryId is provided
  const categoryData = categoryId ? await getCategory(categoryId) : null;
  const categoryName = categoryData?.name?.en || "All Posts";

  // Fetch posts based on parameters
  let result;
  if (nullPosts) {
    result = await getNullTitlePosts(pageNumber, postsPerPage);
  } else if (tag) {
    result = await getPostsByTags([tag], pageNumber, postsPerPage);
  } else {
    result = await getPosts(pageNumber, postsPerPage, false, categoryId);
  }

  const initialPosts = result.posts ?? [];
  const totalPosts = result.total;

  // Fetch featured posts
  const featuredPosts = await getPinnedPosts();

  // Fetch top contributors (category-specific if category is provided)
  const topContributors = await getTopContributors();

  const user = await getServerUser();
  const isAdmin = user?.role === "admin";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Only show in development */}
      {process.env.NODE_ENV === "development" && <ServerEnvChecker />}

      {/* Poster/Banner Section */}
      <div className="hidden md:block relative w-full h-[200px] mb-8 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient">
          <div className="absolute inset-0 bg-black/30 animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-transparent to-black/20 animate-pulse" />
          <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center animate-float">
              Dreamhacker Forum
            </h1>
            <p className="text-lg md:text-xl text-center max-w-2xl animate-float-delayed">
              Join our community to share experiences, ask questions, and
              connect with fellow students
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      </div>
      <div className="block md:hidden mb-8">
        <FeaturedPosts posts={featuredPosts} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Sticky */}
        <div className="lg:w-1/5">
          <div className="sticky top-20">
            {isAdmin && (
              <Button
                asChild
                variant="default"
                className="w-full justify-start mb-6"
              >
                <a href="/create-post">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Post
                </a>
              </Button>
            )}
            <PostsSidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:w-3/5">
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h1 className="text-3xl font-bold">
              {tag
                ? `Posts tagged with "${
                    categories.find((c) => c.id === tag)?.name
                  }"`
                : categoryId
                ? categoryName
                : "All Posts"}
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
                pathname={
                  tag ? `/posts?tag=${tag}` : `/posts?category=${categoryId}`
                }
              />
            </Suspense>
          </div>
        </div>

        {/* Right sidebar - Sticky */}
        <div className="lg:w-1/5">
          <div className="sticky top-20 space-y-6">
            {/* <div className="block md:hidden mb-4">
              <Accordion type="single" collapsible>
                <AccordionItem value="featured">
                  <AccordionTrigger className="text-lg font-semibold">
                    Featured Posts
                  </AccordionTrigger>
                  <AccordionContent>
                    <FeaturedPosts posts={featuredPosts} />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contributors">
                  <AccordionTrigger className="text-lg font-semibold">
                    Top Contributors
                  </AccordionTrigger>
                  <AccordionContent>
                    <TopContributors topContributors={topContributors} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div> */}
            <div className="hidden md:block space-y-6">
              <FeaturedPosts posts={featuredPosts} />
              <TopContributors topContributors={topContributors} />
            </div>
          </div>
        </div>
      </div>

      <RunningCat />
    </div>
  );
}
