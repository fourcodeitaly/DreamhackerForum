import { PostList } from "@/components/post/post-list";
import { SortFilter } from "@/components/sort-filter";
import { SearchBar } from "@/components/layout/search-bar";
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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const dynamic = "force-dynamic";

const categories: { id: string; name: string }[] = [
  { id: "us", name: "United States" },
  { id: "ca", name: "Canada" },
  { id: "hk", name: "Hong Kong" },
  { id: "sg", name: "Singapore" },
  { id: "jp", name: "Japan" },
  { id: "se", name: "Sweden" },
  { id: "au", name: "Australia" },
  { id: "it", name: "Italy" },
  { id: "ch", name: "Switzerland" },
  { id: "uk", name: "United Kingdom" },
  { id: "fr", name: "France" },
  { id: "nl", name: "Netherlands" },
  { id: "dk", name: "Denmark" },
  { id: "fi", name: "Finland" },
  { id: "ie", name: "Ireland" },
  { id: "cn", name: "China" },
  { id: "de", name: "Germany" },
  { id: "es", name: "Spain" },
  { id: "hu", name: "Hungary" },
  { id: "scholarship", name: "Scholarship" },
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
