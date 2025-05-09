"use client";

import { useState } from "react";
import { CommentItem } from "./comment-item";
import type { Comment } from "@/lib/types/comment";

interface CommentListProps {
  comments: Comment[];
  postId: string;
  parentId?: string | null;
  depth?: number;
  onCommentUpdate: (comment: Comment) => void;
  onCommentDelete: (commentId: string) => void;
}

export function CommentList({
  comments,
  postId,
  parentId = null,
  depth = 0,
  onCommentUpdate,
  onCommentDelete,
}: CommentListProps) {
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});
  const [loadingReplies, setLoadingReplies] = useState<Record<string, boolean>>(
    {}
  );
  const [commentReplies, setCommentReplies] = useState<
    Record<string, Comment[]>
  >({});

  // Load replies for a comment
  const loadReplies = async (commentId: string) => {
    if (loadingReplies[commentId]) return;

    setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));

    try {
      const params = new URLSearchParams({
        post_id: postId,
        parent_id: commentId,
        sort: "top",
        limit: "50",
      });

      const response = await fetch(`/api/comments?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch replies");
      }

      const data = await response.json();

      setCommentReplies((prev) => ({ ...prev, [commentId]: data.comments }));
      setExpandedReplies((prev) => ({ ...prev, [commentId]: true }));
    } catch (error) {
      console.error("Error loading replies:", error);
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  // Toggle replies visibility
  const toggleReplies = (commentId: string) => {
    if (!expandedReplies[commentId]) {
      if (!commentReplies[commentId]) {
        loadReplies(commentId);
      } else {
        setExpandedReplies((prev) => ({ ...prev, [commentId]: true }));
      }
    } else {
      setExpandedReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  // Add a new reply to a comment
  const handleNewReply = (parentId: string, newReply: Comment) => {
    setCommentReplies((prev) => ({
      ...prev,
      [parentId]: [...(prev[parentId] || []), newReply],
    }));

    // Make sure replies are expanded
    setExpandedReplies((prev) => ({ ...prev, [parentId]: true }));
  };

  // Update a reply
  const handleReplyUpdate = (updatedReply: Comment) => {
    const parentId = updatedReply.parent_id;

    if (parentId) {
      setCommentReplies((prev) => ({
        ...prev,
        [parentId]: (prev[parentId] || []).map((reply) =>
          reply.id === updatedReply.id ? updatedReply : reply
        ),
      }));
    }

    onCommentUpdate(updatedReply);
  };

  // Delete a reply
  const handleReplyDelete = (commentId: string, parentId: string | null) => {
    if (parentId) {
      setCommentReplies((prev) => ({
        ...prev,
        [parentId]: (prev[parentId] || []).map((reply) =>
          reply.id === commentId
            ? { ...reply, content: "[deleted]", status: "deleted" }
            : reply
        ),
      }));
    }

    onCommentDelete(commentId);
  };

  return (
    <div
      className={`space-y-6 ${
        depth > 0 ? "pl-4 md:pl-8 border-l border-muted/40" : ""
      }`}
    >
      {comments.map(
        (comment) =>
          !comment.status ||
          (comment.status !== "deleted" && (
            <div key={comment.id} className="comment-thread">
              <CommentItem
                comment={comment}
                postId={postId}
                depth={depth}
                replyCount={comment.reply_count || 0}
                isRepliesExpanded={!!expandedReplies[comment.id]}
                isLoadingReplies={!!loadingReplies[comment.id]}
                onToggleReplies={() => toggleReplies(comment.id)}
                onNewReply={handleNewReply}
                onCommentUpdate={onCommentUpdate}
                onCommentDelete={onCommentDelete}
              />

              {expandedReplies[comment.id] && commentReplies[comment.id] && (
                <div className="mt-4">
                  <CommentList
                    comments={commentReplies[comment.id]}
                    postId={postId}
                    parentId={comment.id}
                    depth={depth + 1}
                    onCommentUpdate={handleReplyUpdate}
                    onCommentDelete={(commentId) =>
                      handleReplyDelete(commentId, comment.id)
                    }
                  />
                </div>
              )}
            </div>
          ))
      )}
    </div>
  );
}
