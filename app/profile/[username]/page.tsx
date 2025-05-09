import { UserProfile } from "@/components/user-profile";
import { UserPosts } from "@/components/user-posts";
import { UserSavedPosts } from "@/components/user-saved-posts";
import { UserActivity } from "@/components/user-activity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notFound } from "next/navigation";
import { queryOne } from "@/lib/db/postgres";
import { getUserStats } from "@/lib/db/users/users-query";
import { getUserByUsername } from "@/lib/db/users";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  // Get user data
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  // Get user stats and badges in parallel
  const stats = await getUserStats(user.id);

  // Prepare user data with additional stats
  const userData = {
    ...user,
    postsCount: stats.postsCount,
    commentsCount: stats.commentsCount,
    likesReceived: stats.likesReceived,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile user={userData} />
      <div className="mt-8">
        <Tabs defaultValue="posts">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <UserPosts
              username={username}
              totalPosts={stats.postsCount}
              initialPosts={[]}
            />
          </TabsContent>
          <TabsContent value="saved">
            <UserSavedPosts username={username} />
          </TabsContent>
          <TabsContent value="activity">
            <UserActivity userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
