import { UserProfile } from "@/components/user/user-profile";
import { UserPosts } from "@/components/post/user-posts";
import { UserSavedPosts } from "@/components/user/user-saved-posts";
import { UserActivity } from "@/components/user/user-activity";
import { FollowList } from "@/components/user/follow-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notFound } from "next/navigation";
import { getUserByUsername, getUserStats } from "@/lib/db/users-get";
import { getSavedPosts, getUserPosts } from "@/lib/db/posts/post-get";
import {
  getUserFollowers,
  getUserFollowing,
  getUserFollowStatus,
} from "@/lib/db/follows/follows-get";
import { getServerUser } from "@/lib/supabase/server";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  const currentUser = await getServerUser();

  // Get user data
  const user = await getUserByUsername(username);

  if (!user) {
    notFound();
  }

  // Get user stats, badges, and follow data in parallel
  const [stats, savedPosts, followers, following, posts] = await Promise.all([
    getUserStats(user.id),
    getSavedPosts(user.id),
    getUserFollowers(user.id),
    getUserFollowing(user.id),
    getUserPosts(user.id, 1, 5),
  ]);

  // Check if current user follows this user
  const isFollowed = currentUser
    ? await getUserFollowStatus(currentUser.id, user.id)
    : false;

  // Prepare user data with additional stats
  const userData = {
    ...user,
    postsCount: stats.postsCount,
    commentsCount: stats.commentsCount,
    likesReceived: stats.likesReceived,
    followers_count: followers.length,
    following_count: following.length,
    isFollowed,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile user={userData} />
      <div className="mt-8">
        <Tabs defaultValue="posts">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="follows">Follows</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <UserPosts
              userId={user.id}
              totalPosts={stats.postsCount}
              initialPosts={posts.posts}
            />
          </TabsContent>
          <TabsContent value="saved">
            <UserSavedPosts savedPosts={savedPosts} />
          </TabsContent>
          <TabsContent value="activity">
            {/* <UserActivity userId={user.id} /> */}
          </TabsContent>
          <TabsContent value="follows">
            <FollowList
              userId={user.id}
              initialFollowers={followers}
              initialFollowing={following}
              followersCountProp={followers.length}
              followingCountProp={following.length}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
