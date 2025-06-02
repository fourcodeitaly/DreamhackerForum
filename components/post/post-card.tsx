"use client";

import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Bookmark, Award } from "lucide-react";
import type { Post } from "@/lib/db/posts/posts-modify";
import { toCamelCase } from "@/utils/snake-case";
import { cn, formatRelativeTime } from "@/utils/utils";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const postTitle =
    post.title?.[language as keyof typeof post.title] || post.title?.en || "";
  const hasScholarshipTag = post.tags?.some(
    (tag) => tag.id === "c34d416e-1bed-4474-a020-e83032e2b15d"
  );
  const hasInternshipTag = post.tags?.some(
    (tag) => tag.id === "8dbc5297-53da-482b-b895-0345d5143bbd"
  );

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <div className="flex place-items-start gap-2 justify-between">
          <Link href={`/posts/${post.id}`} className="block">
            <h2 className="text-sm font-medium hover:underline mb-2">
              <span className="mr-2">🔥</span>
              {postTitle}
              <span className="text-xs text-muted-foreground font-light text-nowrap">
                ・{post.user?.name}
              </span>
            </h2>
          </Link>
          <div className="flex gap-2 items-center">
            <div className="flex flex-col gap-2 items-end">
              {hasInternshipTag && (
                <Link href={`/internships`}>
                  <Badge
                    variant="default"
                    className="bg-green-700 hover:bg-green-800 text-nowrap"
                  >
                    {t("internship").split(")")[1]}
                  </Badge>
                </Link>
              )}
              {hasScholarshipTag && (
                <Link href={`/scholarships`}>
                  <Badge
                    variant="default"
                    className="bg-yellow-500 hover:bg-yellow-600 text-nowrap animate-pulse"
                  >
                    {t("scholarship").split(")")[1]}
                  </Badge>
                </Link>
              )}
              {post.event && (
                <Link href={`/events/${post.event.id}`}>
                  <Badge
                    variant="default"
                    className="bg-red-500 hover:bg-red-600 text-nowrap"
                  >
                    {t("eventsTag").split(")")[1]}
                  </Badge>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 text-xs text-muted-foreground justify-between">
          <div className="flex items-center gap-2 flex-wrap">
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
            {post.tags && post.tags.length > 1 ? (
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
          </div>

          <div className="flex gap-2 justify-between items-center">
            <div className="flex justify-end text-xs text-muted-foreground gap-4">
              <div className="flex items-center">
                <Heart
                  className={cn(
                    "h-3 w-3 mr-1",
                    post.liked
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground"
                  )}
                />
                {post.likes_count || 0}
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-3 w-3 mr-1 text-green-700" />
                {post.comments_count || 0}
              </div>
              <div className="flex items-center">
                <Bookmark className="h-3 w-3 mr-1 text-yellow-700" />
                {post.saved_count || 0}
              </div>
            </div>
            <div className="text-xs text-muted-foreground border-[1px] rounded-full px-2 py-1 border-muted-foreground ml-2">
              {formatRelativeTime(post.created_at || "")}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
