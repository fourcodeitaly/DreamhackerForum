import type { User } from "@/lib/db/users-get";

export type CommentVoteType = 1 | -1 | 0; // 1 for upvote, -1 for downvote, 0 for no vote

export type CommentSortType = "top" | "new" | "old" | "controversial";

export type CommentStatus = "active" | "hidden" | "deleted";

export interface CommentVote {
  user_id: string;
  comment_id: string;
  vote_type: CommentVoteType;
  created_at: string;
}

export interface CommentReport {
  id: string;
  comment_id: string;
  user_id: string;
  reason: string;
  status: "pending" | "reviewed" | "dismissed";
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string | null;
  is_markdown: boolean;
  is_edited: boolean;
  edited_at: string | null;
  status: CommentStatus;
  upvotes: number;
  downvotes: number;

  // Joined fields
  author?: User;
  vote_score?: number;
  user_vote?: CommentVoteType;
  replies?: Comment[];
  reply_count?: number;
  depth?: number;
}

export interface CommentFormData {
  content: string;
  parent_id?: string | null;
  is_markdown?: boolean;
}

export interface CommentEditData {
  content: string;
  is_markdown?: boolean;
}
