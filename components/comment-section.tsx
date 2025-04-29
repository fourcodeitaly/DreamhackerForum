"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { formatRelativeTime, cn } from "@/lib/utils"
import { Heart, Loader2, MessageSquare, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createSafeClientSupabaseClient } from "@/lib/supabase"
import type { Comment } from "@/lib/db/comments"

interface CommentSectionProps {
  postId: string
  initialComments?: Comment[]
}

export function CommentSection({ postId, initialComments = [] }: CommentSectionProps) {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(initialComments.length === 0)
  const [error, setError] = useState<string | null>(null)

  // Fetch comments if no initial comments were provided
  useEffect(() => {
    if (initialComments.length === 0) {
      fetchComments()
    }
  }, [initialComments.length, postId])

  const fetchComments = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createSafeClientSupabaseClient()
      if (!supabase) {
        throw new Error("Failed to create Supabase client")
      }

      // Fetch comments for this post
      const { data, error } = await supabase
        .from("comments")
        .select(`
          *,
          user:user_id(id, name, username, image_url)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      // Get likes for each comment
      const commentsWithLikes = await Promise.all(
        (data || []).map(async (comment) => {
          try {
            // Get likes count
            const { count } = await supabase
              .from("comment_likes")
              .select("*", { count: "exact", head: true })
              .eq("comment_id", comment.id)

            // Check if current user liked this comment
            let liked = false
            if (user) {
              const { data: likeData } = await supabase
                .from("comment_likes")
                .select("*")
                .eq("comment_id", comment.id)
                .eq("user_id", user.id)
                .single()
              liked = !!likeData
            }

            return {
              ...comment,
              likesCount: count || 0,
              liked,
            }
          } catch (likeError) {
            console.error("Error fetching likes for comment:", likeError)
            return {
              ...comment,
              likesCount: 0,
              liked: false,
            }
          }
        }),
      )

      setComments(commentsWithLikes)
    } catch (err) {
      console.error("Error fetching comments:", err)
      setError(err instanceof Error ? err.message : "Failed to load comments")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !newComment.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const supabase = createSafeClientSupabaseClient()
      if (!supabase) {
        throw new Error("Failed to create Supabase client")
      }

      // Insert the new comment
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim(),
        })
        .select()

      if (error) {
        throw error
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned after comment creation")
      }

      // Fetch the newly created comment with user details
      const { data: newCommentData, error: fetchError } = await supabase
        .from("comments")
        .select(`
          *,
          user:user_id(id, name, username, image_url)
        `)
        .eq("id", data[0].id)
        .single()

      if (fetchError) {
        throw fetchError
      }

      // Add the new comment to the list
      setComments((prev) => [
        {
          ...newCommentData,
          likesCount: 0,
          liked: false,
        },
        ...prev,
      ])

      setNewComment("")
    } catch (err) {
      console.error("Error submitting comment:", err)
      setError(err instanceof Error ? err.message : "Failed to submit comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) return

    try {
      const supabase = createSafeClientSupabaseClient()
      if (!supabase) {
        throw new Error("Failed to create Supabase client")
      }

      // Find the comment in our state
      const commentToUpdate = comments.find((c) => c.id === commentId)
      if (!commentToUpdate) return

      // Optimistically update UI
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            const newLikedState = !comment.liked
            return {
              ...comment,
              liked: newLikedState,
              likesCount: newLikedState ? (comment.likesCount || 0) + 1 : Math.max((comment.likesCount || 0) - 1, 0),
            }
          }
          return comment
        }),
      )

      // Check if already liked
      const { data: existingLike } = await supabase
        .from("comment_likes")
        .select("*")
        .eq("comment_id", commentId)
        .eq("user_id", user.id)
        .single()

      if (existingLike) {
        // Unlike
        await supabase.from("comment_likes").delete().eq("comment_id", commentId).eq("user_id", user.id)
      } else {
        // Like
        await supabase.from("comment_likes").insert([{ comment_id: commentId, user_id: user.id }])
      }
    } catch (err) {
      console.error("Error toggling comment like:", err)
      // Revert the optimistic update if there was an error
      fetchComments()
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-2xl font-bold">{t("comments")}</h2>
      </div>

      {isAuthenticated ? (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.image_url || "/placeholder.svg"} alt={user?.name || ""} />
                  <AvatarFallback>{user?.name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder={t("writeComment")}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px] resize-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    t("submitComment")
                  )}
                </Button>
              </div>
              {error && (
                <div className="p-3 text-sm bg-red-50 border border-red-200 rounded-md text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="mb-4">{t("loginToComment")}</p>
            <Button asChild>
              <Link href="/login">{t("login")}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 rounded bg-muted"></div>
                    <div className="h-3 w-16 rounded bg-muted"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted"></div>
                  <div className="h-4 w-3/4 rounded bg-muted"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error && comments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <p className="text-muted-foreground">{t("errorLoadingComments")}</p>
              <Button onClick={fetchComments} variant="outline" size="sm" className="mt-2">
                {t("tryAgain")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : comments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">{t("noComments")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={comment.user?.image_url || "/placeholder.svg"} alt={comment.user?.name || ""} />
                      <AvatarFallback>{comment.user?.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{comment.user?.name || t("anonymousUser")}</div>
                      <div className="text-xs text-muted-foreground">{formatRelativeTime(comment.created_at)}</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap break-words">{comment.content}</p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikeComment(comment.id)}
                  disabled={!isAuthenticated}
                  className="flex items-center gap-1 px-2"
                >
                  <Heart
                    className={cn("h-4 w-4", comment.liked ? "fill-red-500 text-red-500" : "text-muted-foreground")}
                  />
                  <span className={cn("text-xs", comment.liked ? "text-red-500" : "text-muted-foreground")}>
                    {comment.likesCount || 0}
                  </span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
