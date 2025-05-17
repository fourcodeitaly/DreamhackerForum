"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { formatRelativeTime, cn } from "@/utils/utils";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Edit,
  Flag,
  Loader2,
  MessageSquare,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { CommentForm } from "./comment-form";
import { CommentEditor } from "./comment-editor";
import { ReportCommentDialog } from "./report-comment-dialog";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/markdown";
import type { Comment } from "@/lib/types/comment";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  depth: number;
  replyCount: number;
  isRepliesExpanded: boolean;
  isLoadingReplies: boolean;
  onToggleReplies: () => void;
  onNewReply: (parentId: string, reply: Comment) => void;
  onCommentUpdate: (comment: Comment) => void;
  onCommentDelete: (commentId: string) => void;
}

export function CommentItem({
  comment,
  postId,
  depth,
  replyCount,
  isRepliesExpanded,
  isLoadingReplies,
  onToggleReplies,
  onNewReply,
  onCommentUpdate,
  onCommentDelete,
}: CommentItemProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [voteStatus, setVoteStatus] = useState({
    score: (comment.upvotes || 0) - (comment.downvotes || 0),
    userVote: comment.user_vote || 0,
    isVoting: false,
  });

  const isDeleted = comment.status === "deleted";
  const isOwner = user?.id === comment.user_id;
  const isAdmin = user?.role === "admin";
  const canModify = isOwner || isAdmin;

  // Handle voting
  const handleVote = async (voteType: 1 | -1) => {
    if (!isAuthenticated || voteStatus.isVoting) return;

    // If user clicks the same vote button, treat as toggling the vote off
    const newVoteType = voteStatus.userVote === voteType ? 0 : voteType;

    // Optimistically update UI
    setVoteStatus((prev) => ({
      ...prev,
      score: prev.score + (newVoteType - prev.userVote),
      userVote: newVoteType,
      isVoting: true,
    }));

    try {
      const response = await fetch(`/api/comments/${comment.id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vote_type: newVoteType }),
      });

      if (!response.ok) {
        throw new Error("Failed to vote");
      }

      const data = await response.json();

      // Update with actual server data
      setVoteStatus((prev) => ({
        ...prev,
        score: data.vote_score,
        userVote: data.vote_type,
      }));
    } catch (error) {
      console.error("Error voting:", error);

      // Revert optimistic update on error
      setVoteStatus((prev) => ({
        ...prev,
        score: comment.vote_score || 0,
        userVote: comment.user_vote || 0,
      }));
    } finally {
      setVoteStatus((prev) => ({ ...prev, isVoting: false }));
    }
  };

  // Handle reply submission
  const handleReplySubmit = (newReply: Comment) => {
    onNewReply(comment.id, newReply);
    setIsReplying(false);
  };

  // Handle comment update
  const handleCommentUpdate = (updatedComment: Comment) => {
    onCommentUpdate(updatedComment);
    setIsEditing(false);
  };

  // Handle comment delete
  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      onCommentDelete(comment.id);
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all shadow-none border-none",
        depth > 0 && "border-l-2 border-slate-600 rounded-l-none",
        isDeleted && "opacity-70"
      )}
    >
      <CardHeader className="pb-2 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="size-8 border border-primary/10">
              <AvatarImage
                src={
                  comment.author?.image_url ||
                  "/placeholder.svg?height=32&width=32&query=user"
                }
                alt={comment.author?.name || ""}
              />
              <AvatarFallback>
                {comment.author?.name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-light text-xs">
                  {comment.author?.name || t("anonymousUser")}
                </span>
                {comment.author?.role === "admin" && (
                  <Badge
                    variant="outline"
                    className="text-xs px-1 py-0 h-5 bg-primary/5"
                  >
                    {t("admin")}
                  </Badge>
                )}
                ・
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatRelativeTime(comment.created_at)}</span>
                  {comment.is_edited && (
                    <span className="italic">{t("edited")}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!isDeleted && isAuthenticated && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">{t("options")}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canModify && (
                  <>
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>{t("edit")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>{t("delete")}</span>
                    </DropdownMenuItem>
                  </>
                )}
                {!isOwner && (
                  <DropdownMenuItem onClick={() => setIsReporting(true)}>
                    <Flag className="mr-2 h-4 w-4" />
                    <span>{t("report")}</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-0 pt-1">
        {isEditing ? (
          <CommentEditor
            comment={comment}
            onCancel={() => setIsEditing(false)}
            onUpdate={handleCommentUpdate}
          />
        ) : (
          <>
            {isDeleted ? (
              <p className="italic text-muted-foreground">
                {t("commentDeleted")}
              </p>
            ) : comment.is_markdown ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown content={comment.content} />
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-sm break-words leading-relaxed">
                {comment.content}
              </p>
            )}
          </>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center gap-2 bg-muted/5 py-2 shadow-none text-muted-foreground">
        {!isDeleted && (
          <>
            <div className="flex items-center rounded-full border border-slate-200 bg-background px-2 py-1 text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 rounded-full",
                  voteStatus.userVote === 1 && "text-primary"
                )}
                onClick={() => handleVote(1)}
                disabled={!isAuthenticated || voteStatus.isVoting}
              >
                <ArrowUp className="h-4 w-4" />
                <span className="sr-only">{t("upvote")}</span>
              </Button>

              <span
                className={cn(
                  "mx-1 min-w-[20px] text-center text-sm font-medium",
                  voteStatus.score > 0 && "text-primary",
                  voteStatus.score < 0 && "text-destructive"
                )}
              >
                {voteStatus.score}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-6 w-6 rounded-full",
                  voteStatus.userVote === -1 && "text-destructive"
                )}
                onClick={() => handleVote(-1)}
                disabled={!isAuthenticated || voteStatus.isVoting}
              >
                <ArrowDown className="h-4 w-4" />
                <span className="sr-only">{t("downvote")}</span>
              </Button>
            </div>

            {!isReplying && depth < 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setIsReplying(true)}
                disabled={!isAuthenticated}
              >
                <MessageSquare className="mr-1 h-3 w-3" />
                {t("reply")}
              </Button>
            )}
          </>
        )}

        {replyCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-8 text-xs"
            onClick={onToggleReplies}
            disabled={isLoadingReplies}
          >
            {isLoadingReplies ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : isRepliesExpanded ? (
              <ChevronUp className="mr-1 h-3 w-3" />
            ) : (
              <ChevronDown className="mr-1 h-3 w-3" />
            )}
            {isRepliesExpanded
              ? t("hideReplies", { count: replyCount })
              : t("showReplies", { count: replyCount })}
          </Button>
        )}
      </CardFooter>

      {isReplying && (
        <div className="border-t bg-muted/5 p-3">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onCommentSubmit={handleReplySubmit}
            onCancel={() => setIsReplying(false)}
            isReply
          />
        </div>
      )}

      {isReporting && (
        <ReportCommentDialog
          commentId={comment.id}
          isOpen={isReporting}
          onClose={() => setIsReporting(false)}
        />
      )}
    </Card>
  );
}
