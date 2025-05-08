"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { CommentSorter } from "./comment-sorter";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, AlertCircle } from "lucide-react";
import Link from "next/link";
import type { Comment, CommentSortType } from "@/lib/types/comment";

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
}

export function CommentSection({
  postId,
  initialComments = [],
}: CommentSectionProps) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isLoading, setIsLoading] = useState(initialComments.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [sortType, setSortType] = useState<CommentSortType>("top");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch top-level comments
  const fetchComments = async (
    sort: CommentSortType = "top",
    pageNum = 1,
    append = false
  ) => {
    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams({
        post_id: postId,
        sort,
        page: pageNum.toString(),
        limit: "10",
      });

      const response = await fetch(`/api/comments?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();

      if (append) {
        setComments((prev) => [...prev, ...data.comments]);
      } else {
        setComments(data.comments);
        console.log(data.comments);
      }

      setHasMore(data.pagination.hasMore);
      setPage(data.pagination.page);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError(err instanceof Error ? err.message : "Failed to load comments");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (initialComments.length === 0) {
      fetchComments(sortType);
    }
  }, [initialComments.length, postId]);

  // Handle sort change
  const handleSortChange = (newSortType: CommentSortType) => {
    setSortType(newSortType);
    fetchComments(newSortType);
  };

  // Handle load more
  const handleLoadMore = () => {
    fetchComments(sortType, page + 1, true);
  };

  // Handle new comment submission
  const handleNewComment = (newComment: Comment) => {
    // Add the new comment to the list
    setComments((prev) => [newComment, ...prev]);
  };

  // Handle comment update
  const handleCommentUpdate = (updatedComment: Comment) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  };

  // Handle comment delete
  const handleCommentDelete = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, content: "[deleted]", status: "deleted" }
          : comment
      )
    );
  };

  return (
    <div className="mt-10 space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{t("comments")}</h2>
          <span className="ml-2 rounded-full bg-secondary px-2.5 py-0.5 text-sm font-medium">
            {comments.length}
          </span>
        </div>

        <CommentSorter value={sortType} onChange={handleSortChange} />
      </div>

      {isAuthenticated ? (
        <CommentForm postId={postId} onCommentSubmit={handleNewComment} />
      ) : (
        <div className="rounded-lg border-2 border-muted/50 bg-card p-6 text-center shadow-sm">
          <div className="flex flex-col items-center gap-3">
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

            <Button asChild className="mt-4">
              <Link href="/login">{t("login")}</Link>
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-lg border-2 border-destructive/20 bg-card p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <p className="text-muted-foreground">{error}</p>
            <Button
              onClick={() => fetchComments(sortType)}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              <Loader2 className="mr-2 h-4 w-4" />
              {t("tryAgain")}
            </Button>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-lg border-2 border-muted/50 bg-card p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-muted/30 p-3">
              <MessageSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{t("noComments")}</p>
            <p className="text-sm text-muted-foreground">
              {t("beTheFirstToComment")}
            </p>
          </div>
        </div>
      ) : (
        <>
          <CommentList
            comments={comments}
            postId={postId}
            onCommentUpdate={handleCommentUpdate}
            onCommentDelete={handleCommentDelete}
          />

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("loading")}
                  </>
                ) : (
                  t("loadMoreComments")
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
