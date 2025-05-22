"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "@/hooks/use-translation";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";
import type { Post } from "@/lib/db/posts/posts-modify";
import { toCamelCase } from "@/utils/snake-case";
import { formatRelativeTime } from "@/utils/utils";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();

  const postTitle = post.title?.[language] || post.title?.en || "";

  console.log(post.tags);

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <Link href={`/posts/${post.id}`} className="block">
          <h2 className="text-base font-semibold hover:underline mb-2">
            {postTitle}
          </h2>
        </Link>

        <div className="flex items-center gap-2 text-xs text-muted-foreground justify-between">
          <div className="flex items-center gap-4">
            {post.category && (
              <Link href={`/posts?category=${post.category.id}`}>
                <Badge
                  variant="outline"
                  className="hover:bg-accent text-muted-foreground text-xs whitespace-nowrap min-w-[80px]"
                >
                  {t(toCamelCase(post.category.id))}
                </Badge>
              </Link>
            )}
            {post.tags && post.tags.length > 0 ? (
              <>
                <Link href={`/posts?tag=${post.tags[0].id}`}>
                  <Badge
                    variant="outline"
                    className="hover:bg-accent text-muted-foreground text-xs cursor-pointer line-clamp-1"
                  >
                    {post.tags[0].name.length > 30
                      ? `${post.tags[0].name.slice(0, 30)}...`
                      : post.tags[0].name}
                  </Badge>
                </Link>
                {post.tags.length > 1 && (
                  <Link href={`/posts/${post.id}`}>
                    <Badge
                      variant="outline"
                      className="hover:bg-accent text-muted-foreground text-xs cursor-pointer line-clamp-1"
                    >
                      +{post.tags.length - 1}
                    </Badge>
                  </Link>
                )}
              </>
            ) : (
              post.tags?.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="hover:bg-accent text-muted-foreground text-xs cursor-pointer"
                >
                  {tag.name}
                </Badge>
              ))
            )}
            <div className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1 text-green-700" />
              {post.comments_count || 0}
            </div>
          </div>
          <span className="flex justify-end text-xs text-muted-foreground">
            {formatRelativeTime(post.created_at || "")}
          </span>
        </div>
      </CardHeader>
    </Card>
  );
}
