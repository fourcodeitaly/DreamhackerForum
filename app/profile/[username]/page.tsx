import { UserProfile } from "@/components/user-profile";
import { UserPosts } from "@/components/user-posts";
import { UserSavedPosts } from "@/components/user-saved-posts";
import { UserActivity } from "@/components/user-activity";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notFound } from "next/navigation";
import { queryOne, query } from "@/lib/db/postgres";

interface UserStats {
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
}

async function getUserStats(userId: string): Promise<UserStats> {
  try {
    // Get all stats in parallel for better performance
    const [postCount, commentCount, likesCount] = await Promise.all([
      // Get post count
      queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM posts WHERE user_id = $1`,
        [userId]
      ),
      // Get comment count
      queryOne<{ count: number }>(
        `SELECT COUNT(*) as count FROM comments WHERE user_id = $1`,
        [userId]
      ),
      // Get likes received on posts
      queryOne<{ count: number }>(
        `SELECT COUNT(*) as count 
         FROM post_likes pl
         INNER JOIN posts p ON pl.post_id = p.id
         WHERE p.user_id = $1`,
        [userId]
      ),
    ]);

    return {
      postsCount: postCount?.count || 0,
      commentsCount: commentCount?.count || 0,
      likesReceived: likesCount?.count || 0,
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return {
      postsCount: 0,
      commentsCount: 0,
      likesReceived: 0,
    };
  }
}

async function getUserBadges(userId: string, role: string) {
  // Get user badges from database
  const badges = await query<{ id: number; name: string }>(
    `SELECT id, name FROM user_badges WHERE user_id = $1`,
    [userId]
  );

  // Add role-based badge
  const roleBadge = {
    id: role === "admin" ? 2 : 3,
    name: role === "admin" ? "Admin" : "Member",
  };

  // Add early adopter badge if user joined before a certain date
  const earlyAdopterBadge = {
    id: 1,
    name: "Early Adopter",
  };

  return [...badges, roleBadge, earlyAdopterBadge];
}

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  // Get user data
  const user = await queryOne<{
    id: string;
    username: string;
    name: string;
    image_url: string;
    role: string;
    joined_at: string;
  }>(
    `SELECT 
      id,
      username,
      name,
      image_url,
      role,
      joined_at
    FROM users 
    WHERE username = $1`,
    [username]
  );

  if (!user) {
    notFound();
  }

  // Get user stats and badges in parallel
  const [stats] = await Promise.all([
    getUserStats(user.id),
    // getUserBadges(user.id, user.role),
  ]);

  // Prepare user data with additional stats
  const userData = {
    ...user,
    postsCount: stats.postsCount,
    commentsCount: stats.commentsCount,
    likesReceived: stats.likesReceived,
    // badges,
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
