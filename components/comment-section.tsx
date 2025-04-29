"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { Heart, Reply, Loader2 } from "lucide-react"
import { cn, formatRelativeTime } from "@/lib/utils"
import Link from "next/link"
import { createSafeClientSupabaseClient } from "@/lib/supabase"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAuth()
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const supabase = createSafeClientSupabaseClient()
        if (!supabase) {
          setComments([])
          setIsLoading(false)
          return
        }

        // Fetch comments for this post
        const { data, error } = await supabase
          .from("comments")
          .select(`
            *,
            author:user_id(id, name, username, image_url)
          `)
          .eq("post_id", postId)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching comments:", error)
          setComments([])
        } else {
          // Get likes for each comment
          const commentsWithLikes = await Promise.all(
            data.map(async (comment) => {
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
            }),
          )

          setComments(commentsWithLikes)
        }
      } catch (error) {
        console.error("Error in comment fetching:", error)
        setComments([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchComments()
  }, [postId, user])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !newComment.trim()) return

    setIsSubmitting(true)

    try {
      const supabase = createSafeClientSupabaseClient()
      if (!supabase) {
        return
      }

      // Insert the new comment
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          parent_id: replyingTo,
          content: newComment,
        })
        .select()

      if (error) {
        console.error("Error submitting comment:", error)
        return
      }

      // Refresh comments
      const { data: updatedComment, error: fetchError } = await supabase
        .from("comments")
        .select(`
          *,
          author:user_id(id, name, username, image_url)
        `)
        .eq("id", data[0].id)
        .single()

      if (fetchError) {
        console.error("Error fetching updated comment:", fetchError)
        return
      }

      // Add the new comment to the list
      setComments((prev) => [
        {
          ...updatedComment,
          likesCount: 0,
          liked: false,
        },
        ...prev,
      ])

      setNewComment("")
      setReplyingTo(null)
    } catch (error) {
      console.error("Error in comment submission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!user) return

    try {
      const supabase = createSafeClientSupabaseClient()
      if (!supabase) {
        return
      }

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

        // Update local state
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                liked: false,
                likesCount: comment.likesCount - 1,
              }
            }
            return comment
          }),
        )
      } else {
        // Like
        await supabase.from("comment_likes").insert([{ comment_id: commentId, user_id: user.id }])

        // Update local state
        setComments((prev) =>
          prev.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                liked: true,
                likesCount: comment.likesCount + 1,
              }
            }
            return comment
          }),
        )
      }
    } catch (error) {
      console.error("Error toggling comment like:", error)
    }
  }

  const topLevelComments = comments.filter((comment) => !comment.parent_id)
  const replies = comments.filter((comment) => comment.parent_id)

  const getCommentReplies = (commentId: string) => {
    return replies.filter((reply) => reply.parent_id === commentId)
  }

  if (isLoading) {
    return (
      <div className="mt-8" id="comments">
        <Card>
          <CardHeader>
            <CardTitle>{t("comments")}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mt-8" id="comments">
      <Card>
        <CardHeader>
          <CardTitle>{t("comments")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.image_url || "/placeholder.svg"} alt={user?.name || ""} />
                  <AvatarFallback>{user?.name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder={replyingTo ? t("replyToComment") : t("writeComment")}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-2"
                    disabled={isSubmitting}
                  />
                  <div className="flex justify-between items-center">
                    {replyingTo && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                        {t("cancelReply")}
                      </Button>
                    )}
                    <Button type="submit" size="sm" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {replyingTo ? t("replying") : t("commenting")}
                        </>
                      ) : replyingTo ? (
                        t("reply")
                      ) : (
                        t("comment")
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-muted rounded-md text-center">
              <p className="mb-2">{t("loginToComment")}</p>
              <Button asChild size="sm">
                <Link href="/login">{t("login")}</Link>
              </Button>
            </div>
          )}

          <div className="space-y-6">
            {topLevelComments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{t("noComments")}</p>
            ) : (
              topLevelComments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  <div className="flex space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={comment.author?.image_url || "/placeholder.svg"}
                        alt={comment.author?.name || ""}
                      />
                      <AvatarFallback>{comment.author?.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Link href={`/profile/${comment.author?.username}`} className="font-medium hover:underline">
                          {comment.author?.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">{formatRelativeTime(comment.created_at)}</span>
                      </div>
                      <p className="mt-1">{comment.content}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleLikeComment(comment.id)}
                          disabled={!isAuthenticated}
                        >
                          <Heart
                            className={cn(
                              "h-4 w-4 mr-1",
                              comment.liked ? "fill-red-500 text-red-500" : "text-muted-foreground",
                            )}
                          />
                          <span className={cn("text-xs", comment.liked ? "text-red-500" : "text-muted-foreground")}>
                            {comment.likesCount}
                          </span>
                        </Button>

                        {isAuthenticated && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => setReplyingTo(comment.id)}
                          >
                            <Reply className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">{t("reply")}</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Replies */}
                  {getCommentReplies(comment.id).length > 0 && (
                    <div className="ml-14 space-y-4 border-l-2 pl-4">
                      {getCommentReplies(comment.id).map((reply) => (
                        <div key={reply.id} className="flex space-x-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={reply.author?.image_url || "/placeholder.svg"}
                              alt={reply.author?.name || ""}
                            />
                            <AvatarFallback>{reply.author?.name?.[0] || "?"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Link href={`/profile/${reply.author?.username}`} className="font-medium hover:underline">
                                {reply.author?.name}
                              </Link>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(reply.created_at)}
                              </span>
                            </div>
                            <p className="mt-1">{reply.content}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => handleLikeComment(reply.id)}
                                disabled={!isAuthenticated}
                              >
                                <Heart
                                  className={cn(
                                    "h-3 w-3 mr-1",
                                    reply.liked ? "fill-red-500 text-red-500" : "text-muted-foreground",
                                  )}
                                />
                                <span className={cn("text-xs", reply.liked ? "text-red-500" : "text-muted-foreground")}>
                                  {reply.likesCount}
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
