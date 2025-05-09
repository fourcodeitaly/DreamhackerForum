"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";
import type { Post } from "@/lib/db/posts/posts-modify";

interface RelatedPostsProps {
  posts: Post[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  // If there are no posts, don't render anything
  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">
        {t("relatedPosts") || "Related Posts"}
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          // Handle both multilingual and regular title formats
          const title =
            typeof post.title === "object"
              ? post.title?.[language] ||
                post.title?.en ||
                t("untitledPost") ||
                "Untitled Post"
              : post.title || t("untitledPost") || "Untitled Post";

          // Handle both multilingual and regular excerpt formats
          const excerpt =
            post.excerpt && typeof post.excerpt === "object"
              ? post.excerpt[language] || post.excerpt.en || ""
              : typeof post.excerpt === "string"
              ? post.excerpt
              : "";

          return (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <Card className="h-full hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2">{title}</h3>
                  {excerpt && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {excerpt}
                    </p>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">
                    {t("readMore") || "Read more"}
                  </p>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
