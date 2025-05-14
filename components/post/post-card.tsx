"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "@/hooks/use-translation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Markdown } from "@/components/markdown";
import { formatRelativeTime } from "@/utils/utils";
import { MessageSquare, Eye, ExternalLink } from "lucide-react";
import type { Post } from "@/lib/db/posts/posts-modify";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const postTitle = post.title?.[language] || post.title?.en || "";

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <Link href={`/posts/${post.id}`} className="block">
          <h2 className="text-base font-semibold hover:underline mb-2">
            {postTitle}
          </h2>
        </Link>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {post.category && (
            <Link href={`/posts?category=${post.category_id}`}>
              <Badge
                variant="outline"
                className="hover:bg-accent text-primary text-xs"
              >
                {post.category.id}
              </Badge>
            </Link>
          )}
          <div className="flex items-center">
            <MessageSquare className="h-3 w-3 mr-1 text-green-700" />
            {post.comments_count || 0}
          </div>
        </div>
      </CardHeader>
      {/* <CardContent>
        <Link href={`/posts/${post.id}`}>
          <div className="text-sm text-muted-foreground line-clamp-3">
            <Markdown content={postContent} preview={true} />
          </div>
        </Link>
        {post.original_link && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <a
              href={post.original_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              {t("original_source")}
            </a>
          </div>
        )}
      </CardContent> */}
      {/* <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <MessageSquare className="mr-1 h-4 w-4" />
          {post.comments_count || 0}
        </div>
        <div className="flex items-center gap-2">
          <span>{formatRelativeTime(post.created_at || "")}</span>
        </div>
      </CardFooter> */}
    </Card>
  );
}
