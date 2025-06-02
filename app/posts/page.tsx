import { PostList } from "@/components/post/post-list";
import { SortFilter } from "@/components/sort-filter";
import { FeaturedPosts } from "@/components/post/featured-posts";
import { TopContributors } from "@/components/user/top-contributors";
import { PostsSidebar } from "@/components/layout/posts-sidebar";
import { QuickSchoolsView } from "@/components/school/quick-schools-view";
import {
  getPinnedPosts,
  getPosts,
  getPostsByTags,
} from "@/lib/db/posts/post-get";
import { getTopContributors } from "@/lib/db/users/users-get";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTagById } from "@/lib/db/tags/tags-get";
import { EventSlideshow } from "@/components/ui/event-slideshow";
import { getEvents } from "@/lib/db/events/event-get";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerTranslation } from "@/lib/get-translation";
import { toCamelCase } from "@/utils/snake-case";
import { getSchools } from "@/lib/db/schools/school-get";
export const dynamic = "force-dynamic";

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
  const { t } = await getServerTranslation();
  // Get current page from query parameters
  const { page, nullPosts, category, tag } = await searchParams;
  const pageNumber = page ? Number.parseInt(page) : 1;
  const categoryId = category !== "undefined" ? category : undefined;
  const postsPerPage = 10;

  // Fetch category if categoryId is provided
  const session = await getServerSession(authOptions);
  const user = session?.user;

  const [
    // categoryData,
    pinnedPosts,
    topContributors,
    schools,
    upcomingEvents,
    result,
    tagInfo,
  ] = await Promise.all([
    getPinnedPosts(),
    getTopContributors(),
    getSchools({
      limit: 5,
      offset: 0,
      orderBy: "qs_world_rank",
    }),
    getEvents(),
    tag
      ? getPostsByTags([tag], pageNumber, postsPerPage, user?.id)
      : getPosts(pageNumber, postsPerPage, false, categoryId, user?.id),
    tag ? getTagById(tag) : null,
  ]);

  const initialPosts = result?.posts ?? [];
  const totalPosts = result?.total ?? 0;

  return (
    <div className="container mx-auto p-4">
      {/* Upcoming Events Section */}
      <div className="mb-8">
        <EventSlideshow events={upcomingEvents.events} />
      </div>

      {/* <div className="block md:hidden mb-8">
        <FeaturedPosts posts={featuredPosts} />
      </div> */}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Sticky */}
        <div className="lg:w-1/5">
          <div className="sticky top-20">
            <Button
              asChild
              variant="default"
              className="w-full justify-start mb-6"
            >
              <a href="/posts/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("createPost")}
              </a>
            </Button>

            <PostsSidebar />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:w-3/5">
          <div className="flex justify-between items-center">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h1 className="text-md lg:text-2xl font-bold">
                {tag
                  ? `Posts tagged with "${tagInfo?.name}"`
                  : categoryId
                  ? t(toCamelCase(`${categoryId}`))
                  : t("allPosts")}
              </h1>
              {/* <SearchBar /> */}
            </div>
            <div className="mb-6">
              <SortFilter />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <PostList
              posts={initialPosts}
              totalPosts={totalPosts}
              currentPage={pageNumber}
              pathname={
                tag ? `/posts?tag=${tag}` : `/posts?category=${categoryId}`
              }
            />
          </div>
        </div>

        {/* Right sidebar - Sticky */}
        <div className="lg:w-1/5">
          <div className="sticky top-20 space-y-6">
            <div className="hidden md:block space-y-6">
              <FeaturedPosts initialPosts={pinnedPosts} />
              <TopContributors initialTopContributors={topContributors} />
              <QuickSchoolsView initialSchools={schools} />
            </div>
          </div>
        </div>
      </div>

      {/* <RunningCat /> */}
    </div>
  );
}
