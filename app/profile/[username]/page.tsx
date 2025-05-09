import { UserProfile } from "@/components/user-profile"
import { UserPosts } from "@/components/user-posts"
import { UserSavedPosts } from "@/components/user-saved-posts"
import { UserActivity } from "@/components/user-activity"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getUserByUsername } from "@/lib/db/users"

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const user = await getUserByUsername(params.username)

  if (!user) {
    notFound()
  }

  const supabase = await createServerSupabaseClient()

  // Get total post count for this user
  let totalPosts = 0
  let totalComments = 0
  let likesReceived = 0

  if (supabase) {
    try {
      // Get post count
      const { count: postCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      totalPosts = postCount || 0

      // Get comment count
      const { count: commentCount } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      totalComments = commentCount || 0

      // Get likes received (simplified)
      const { count: likesCount } = await supabase
        .from("post_likes")
        .select("*", { count: "exact", head: true })
        .in("post_id", supabase.from("posts").select("id").eq("user_id", user.id))

      likesReceived = likesCount || 0
    } catch (error) {
      console.error("Error fetching user stats:", error)
    }
  }

  // Prepare user data with additional stats
  const userData = {
    ...user,
    postsCount: totalPosts,
    commentsCount: totalComments,
    likesReceived: likesReceived,
    badges: [
      { id: 1, name: "Early Adopter" },
      { id: 2, name: user.role === "admin" ? "Admin" : "Member" },
    ],
    joinedAt: user.joined_at,
  }

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
            <UserPosts username={params.username} totalPosts={totalPosts} />
          </TabsContent>
          <TabsContent value="saved">
            <UserSavedPosts username={params.username} />
          </TabsContent>
          <TabsContent value="activity">
            <UserActivity userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
