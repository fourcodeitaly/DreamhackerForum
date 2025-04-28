import { UserProfile } from "@/components/user-profile"
import { UserPosts } from "@/components/user-posts"
import { UserSavedPosts } from "@/components/user-saved-posts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMockUserByUsername } from "@/lib/mock-data"
import { notFound } from "next/navigation"

export default function ProfilePage({ params }: { params: { username: string } }) {
  const user = getMockUserByUsername(params.username)

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UserProfile user={user} />
      <div className="mt-8">
        <Tabs defaultValue="posts">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <UserPosts username={params.username} />
          </TabsContent>
          <TabsContent value="saved">
            <UserSavedPosts username={params.username} />
          </TabsContent>
          <TabsContent value="activity">
            <div className="p-4 border rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <p>User activity will be displayed here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
