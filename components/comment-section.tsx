"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { formatDistanceToNow } from "date-fns"
import { Heart, Reply } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMockComments } from "@/lib/mock-data"
import Link from "next/link"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [comments, setComments] = useState(getMockComments(postId))
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !newComment.trim()) return

    const comment = {
      id: `comment-${Date.now()}`,
      postId,
      author: {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
      },
      content: newComment,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      liked: false,
      parentId: replyingTo,
    }

    setComments((prev) => [comment, ...prev])
    setNewComment("")
    setReplyingTo(null)
  }

  const handleLikeComment = (commentId: string) => {
    if (!user) return

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          const liked = !comment.liked
          return {
            ...comment,
            liked,
            likesCount: liked ? comment.likesCount + 1 : comment.likesCount - 1,
          }
        }
        return comment
      }),
    )
  }

  const topLevelComments = comments.filter((comment) => !comment.parentId)
  const replies = comments.filter((comment) => comment.parentId)

  const getCommentReplies = (commentId: string) => {
    return replies.filter((reply) => reply.parentId === commentId)
  }

  return (
    <div className="mt-8" id="comments">
      <Card>
        <CardHeader>
          <CardTitle>{t("comments")}</CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder={replyingTo ? t("replyToComment") : t("writeComment")}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex justify-between items-center">
                    {replyingTo && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                        {t("cancelReply")}
                      </Button>
                    )}
                    <Button type="submit" size="sm">
                      {replyingTo ? t("reply") : t("comment")}
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
                      <AvatarImage src={comment.author.image || "/placeholder.svg"} alt={comment.author.name} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Link href={`/profile/${comment.author.username}`} className="font-medium hover:underline">
                          {comment.author.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="mt-1">{comment.content}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleLikeComment(comment.id)}
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

                        {user && (
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
                            <AvatarImage src={reply.author.image || "/placeholder.svg"} alt={reply.author.name} />
                            <AvatarFallback>{reply.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Link href={`/profile/${reply.author.username}`} className="font-medium hover:underline">
                                {reply.author.name}
                              </Link>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="mt-1">{reply.content}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2"
                                onClick={() => handleLikeComment(reply.id)}
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
