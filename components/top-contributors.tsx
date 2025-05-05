"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, MessageSquare, ThumbsUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { createClientSupabaseClient } from "@/lib/supabase/client"
import { useTranslation } from "@/hooks/use-translation"

interface Contributor {
  id: string
  username: string
  name: string
  image_url: string | null
  post_count: number
  comment_count: number
  total_likes: number
}

export function TopContributors() {
  const { t } = useTranslation()
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTopContributors() {
      try {
        setIsLoading(true)
        setError(null)

        const supabase = await createClientSupabaseClient()
        if (!supabase) {
          throw new Error("Failed to create Supabase client")
        }

        // Direct query instead of using the SQL function
        // Note: We're not ordering by created_at since it doesn't exist
        const { data: users, error: usersError } = await supabase
          .from("users")
          .select("id, username, name, image_url")
          .limit(10)

        if (usersError) {
          throw new Error(`Failed to fetch users: ${usersError.message}`)
        }

        // For each user, get their post count
        const enrichedUsers = await Promise.all(
          users.map(async (user) => {
            // Get post count
            const { count: postCount, error: postError } = await supabase
              .from("posts")
              .select("id", { count: "exact", head: true })
              .eq("user_id", user.id)

            if (postError) {
              console.error(`Error fetching posts for user ${user.id}:`, postError)
            }

            // Get comment count
            const { count: commentCount, error: commentError } = await supabase
              .from("comments")
              .select("id", { count: "exact", head: true })
              .eq("user_id", user.id)

            if (commentError) {
              console.error(`Error fetching comments for user ${user.id}:`, commentError)
            }

            // Get post likes count - simplified query
            const { data: posts, error: postsError } = await supabase.from("posts").select("id").eq("user_id", user.id)

            if (postsError) {
              console.error(`Error fetching posts for user ${user.id}:`, postsError)
            }

            let postLikesCount = 0
            if (posts && posts.length > 0) {
              const postIds = posts.map((post) => post.id)
              const { count, error: likesError } = await supabase
                .from("post_likes")
                .select("post_id", { count: "exact", head: true })
                .in("post_id", postIds)

              if (likesError) {
                console.error(`Error fetching post likes for user ${user.id}:`, likesError)
              } else {
                postLikesCount = count || 0
              }
            }

            // Get comment likes count - simplified query
            const { data: comments, error: commentsError } = await supabase
              .from("comments")
              .select("id")
              .eq("user_id", user.id)

            if (commentsError) {
              console.error(`Error fetching comments for user ${user.id}:`, commentsError)
            }

            let commentLikesCount = 0
            if (comments && comments.length > 0) {
              const commentIds = comments.map((comment) => comment.id)
              const { count, error: likesError } = await supabase
                .from("comment_likes")
                .select("comment_id", { count: "exact", head: true })
                .in("comment_id", commentIds)

              if (likesError) {
                console.error(`Error fetching comment likes for user ${user.id}:`, likesError)
              } else {
                commentLikesCount = count || 0
              }
            }

            return {
              ...user,
              post_count: postCount || 0,
              comment_count: commentCount || 0,
              total_likes: postLikesCount + commentLikesCount,
            }
          }),
        )

        // Sort by activity score (posts count more than comments)
        const sortedUsers = enrichedUsers.sort((a, b) => {
          const scoreA = a.post_count * 2 + a.comment_count + a.total_likes
          const scoreB = b.post_count * 2 + b.comment_count + b.total_likes
          return scoreB - scoreA
        })

        setContributors(sortedUsers.slice(0, 5))
      } catch (err) {
        console.error("Error fetching top contributors:", err)
        setError(err instanceof Error ? err.message : "Failed to load top contributors")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopContributors()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            {t("topContributors", "Top Contributors")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            {t("topContributors", "Top Contributors")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p>Failed to load contributors</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (contributors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            {t("topContributors", "Top Contributors")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p>No contributors found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          {t("topContributors", "Top Contributors")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contributors.map((user, index) => (
            <Link
              key={user.id}
              href={`/profile/${user.username}`}
              className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted transition-colors"
            >
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-background">
                  <AvatarImage
                    src={user.image_url || "/placeholder.svg?height=40&width=40&query=user"}
                    alt={user.name || user.username}
                  />
                  <AvatarFallback>{(user.name || user.username)?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                {index < 3 && (
                  <Badge
                    className={`absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full ${
                      index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-700"
                    }`}
                  >
                    {index + 1}
                  </Badge>
                )}
              </div>
              <div>
                <div className="font-medium">{user.name || user.username}</div>
                <div className="text-xs text-muted-foreground">@{user.username}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center text-xs">
                    <MessageSquare className="mr-1 h-3 w-3" />
                    {user.post_count + user.comment_count}
                  </div>
                  <div className="flex items-center text-xs">
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    {user.total_likes}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
