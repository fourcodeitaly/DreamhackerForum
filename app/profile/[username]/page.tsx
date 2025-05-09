// import { UserProfile } from "@/components/user-profile"
// import { UserPosts } from "@/components/user-posts"
// import { UserSavedPosts } from "@/components/user-saved-posts"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { notFound } from "next/navigation"
// import { createClient } from "@/lib/supabase/server"
// import { getUserByUsername } from "@/lib/db/users"

// export default async function ProfilePage({ params }: { params: { username: string } }) {
//   const user = await getUserByUsername(params.username)

//   if (!user) {
//     notFound()
//   }

//   const supabase = createClient()

//   // Get total post count for this user
//   const { count } = await supabase.from("posts").select("*", { count: "exact", head: true }).eq("author_id", user.id)

//   const totalPosts = count || 0

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <UserProfile user={user} />
//       <div className="mt-8">
//         <Tabs defaultValue="posts">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="posts">Posts</TabsTrigger>
//             <TabsTrigger value="saved">Saved</TabsTrigger>
//             <TabsTrigger value="activity">Activity</TabsTrigger>
//           </TabsList>
//           <TabsContent value="posts">
//             <UserPosts username={params.username} totalPosts={totalPosts} />
//           </TabsContent>
//           <TabsContent value="saved">
//             <UserSavedPosts username={params.username} />
//           </TabsContent>
//           <TabsContent value="activity">
//             <div className="p-4 border rounded-lg">
//               <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
//               <p>User activity will be displayed here.</p>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }
