"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { formatRelativeTime, cn } from "@/lib/utils";
import { Heart, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { Comment } from "@/lib/db/comments";

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
}

// Update the CommentSection component with better styling
export function CommentSection({
  postId,
  initialComments = [],
}: CommentSectionProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoading] = useState(
    initialComments.length === 0
  );
  const [error, setError] = useState<string | null>(null);

  // Fetch comments if no initial comments were provided
  useEffect(() => {
    if (initialComments.length === 0) {
      fetchComments();
    }
  }, [initialComments.length, postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments?post_id=${postId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          content: newComment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      const data = await response.json();

      // Add the new comment to the list
      setComments((prev) => [data.comment, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError(err instanceof Error ? err.message : "Failed to submit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!user) return;

    try {
      // Optimistically update UI
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === commentId) {
            const newLikedState = !comment.liked;
            return {
              ...comment,
              liked: newLikedState,
              likes_count: newLikedState
                ? (comment.likes_count || 0) + 1
                : Math.max((comment.likes_count || 0) - 1, 0),
            };
          }
          return comment;
        })
      );

      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }
    } catch (err) {
      console.error("Error toggling comment like:", err);
      // Revert the optimistic update if there was an error
      fetchComments();
    }
  };

  return (
    <div className="mt-10 space-y-8">
      <div className="flex items-center gap-3 border-b pb-4">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">{t("comments")}</h2>
        <span className="ml-2 rounded-full bg-secondary px-2.5 py-0.5 text-sm font-medium">
          {comments.length}
        </span>
      </div>

      {isAuthenticated ? (
        <Card className="overflow-hidden border-2 border-muted/50 shadow-sm">
          <CardHeader className="bg-muted/20 pb-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarImage
                  src={
                    user?.image_url ||
                    "/placeholder.svg?height=40&width=40&query=user"
                  }
                  alt={user?.name || ""}
                />
                <AvatarFallback>{user?.name?.[0] || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {user?.name || t("anonymousUser")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("writingPublicly")}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                placeholder={t("writeComment")}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[120px] resize-none border-2 focus-visible:ring-primary/50"
                disabled={isSubmitting}
              />

              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="relative overflow-hidden transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("submitting")}
                    </>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {t("submitComment")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-muted/50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {t("joinTheConversation")}
              </h3>
              <p className="mt-1 text-muted-foreground">
                {t("loginToComment")}
              </p>
            </div>
            <Button asChild className="mt-2">
              <Link href="/login">{t("login")}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoadingComments ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="animate-pulse overflow-hidden border border-muted/30"
            >
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
        <Card className="border-2 border-destructive/20">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-muted-foreground">{t("errorLoadingComments")}</p>
            <Button
              onClick={fetchComments}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <Loader2 className="mr-2 h-4 w-4" />
              {t("tryAgain")}
            </Button>
          </CardContent>
        </Card>
      ) : comments.length === 0 ? (
        <Card className="border-2 border-muted/50">
          <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="rounded-full bg-muted/30 p-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t("noComments")}</p>
            <p className="text-sm text-muted-foreground">
              {t("beTheFirstToComment")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Card
              key={comment.id}
              className="overflow-hidden border-muted/50 transition-all hover:border-muted"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10 border border-primary/10">
                      <AvatarImage
                        src={
                          comment.author?.image_url ||
                          "/placeholder.svg?height=40&width=40&query=user"
                        }
                        alt={comment.author?.name || ""}
                      />
                      <AvatarFallback>
                        {comment.author?.name?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {comment.author?.name || t("anonymousUser")}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatRelativeTime(comment.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-3 pt-2">
                <p className="whitespace-pre-wrap break-words text-base leading-relaxed">
                  {comment.content}
                </p>
              </CardContent>
              <CardFooter className="border-t bg-muted/10 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLikeComment(comment.id)}
                  disabled={!isAuthenticated}
                  className="flex items-center gap-1 px-2 text-xs"
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      comment.liked
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-xs",
                      comment.liked ? "text-red-500" : "text-muted-foreground"
                    )}
                  >
                    {comment.likes_count || 0}
                  </span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
