"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileText, MessageSquare, ThumbsUp } from "lucide-react"
import { useState, useEffect } from "react"
import { createClientSupabaseClient } from "@/lib/supabase/client"

interface UserActivityProps {
  userId: string
}

export function UserActivity({ userId }: UserActivityProps) {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    async function fetchUserActivity() {
      setLoading(true)
      try {
        const supabase = createClientSupabaseClient()
        if (!supabase) return

        // This is a simplified example - in a real app, you'd have a proper activity table
        // Here we're just getting posts and comments as "activities"

        // Get user's posts
        const { data: posts } = await supabase
          .from("posts")
          .select("id, title, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5)

        // Get user's comments
        const { data: comments } = await supabase
          .from("comments")
          .select("id, content, created_at, post_id, posts(title)")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(5)

        // Format activities
        const formattedPosts = (posts || []).map((post) => ({
          id: `post-${post.id}`,
          type: "post",
          title: post.title,
          date: new Date(post.created_at),
          icon: FileText,
        }))

        const formattedComments = (comments || []).map((comment) => ({
          id: `comment-${comment.id}`,
          type: "comment",
          title: comment.posts?.title || "Unknown post",
          content: comment.content,
          date: new Date(comment.created_at),
          icon: MessageSquare,
        }))

        // Combine and sort by date
        const allActivities = [...formattedPosts, ...formattedComments].sort(
          (a, b) => b.date.getTime() - a.date.getTime(),
        )

        setActivities(allActivities)
      } catch (error) {
        console.error("Error fetching user activity:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserActivity()
  }, [userId])

  const filteredActivities =
    activeTab === "all" ? activities : activities.filter((activity) => activity.type === activeTab)

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Activity</TabsTrigger>
            <TabsTrigger value="post">Posts</TabsTrigger>
            <TabsTrigger value="comment">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-md bg-muted animate-pulse" />
                ))}
              </div>
            ) : filteredActivities.length > 0 ? (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 border-b pb-4">
                    <div className="mt-1 rounded-full bg-muted p-2">
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{activity.type}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString()}
                        </span>
                      </div>
                      <h4 className="mt-1 font-medium">{activity.title}</h4>
                      {activity.content && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{activity.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-muted p-3">
                  {activeTab === "post" ? (
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  ) : activeTab === "comment" ? (
                    <MessageSquare className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <ThumbsUp className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <h3 className="mt-4 text-lg font-medium">No activity found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {activeTab === "all"
                    ? "This user hasn't posted or commented yet."
                    : `No ${activeTab}s found for this user.`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
