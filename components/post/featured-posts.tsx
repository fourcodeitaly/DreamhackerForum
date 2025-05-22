"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/utils";
import type { Post } from "@/lib/db/posts/posts-modify";
import { toCamelCase } from "@/utils/snake-case";

export function FeaturedPosts({ posts }: { posts: Post[] }) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (posts.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % posts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [posts.length]);

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-muted h-80 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 border-4 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (posts.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {posts.map((post, index) => (
          <div key={post.id} className="min-w-full">
            <Card className="border-0 overflow-hidden">
              <div className="relative h-52 md:h-80 w-full">
                <img
                  src={
                    post.image_url ||
                    "https://www.harvard.edu/wp-content/uploads/2023/11/110823_Features_KS_713-scaled.jpg"
                  }
                  alt={post.title?.en || ""}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <Badge className="mb-2 bg-blue-600 hover:bg-blue-700">
                    {t(toCamelCase(post.category_id || "")) || t("featured")}
                  </Badge>
                  <h2 className="text-md font-bold mb-2">
                    {post.title?.en || ""}
                  </h2>
                  <Button asChild variant="default" size="sm">
                    <Link href={`/posts/${post.id}`}>{t("readMore")}</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="absolute bottom-6 right-4 flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/30 hover:text-white"
          onClick={() =>
            setActiveIndex((prev) => (prev - 1 + posts.length) % posts.length)
          }
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">{t("previous")}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full bg-black/20 backdrop-blur-sm border-white/20 text-white hover:bg-black/30 hover:text-white"
          onClick={() => setActiveIndex((prev) => (prev + 1) % posts.length)}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">{t("next")}</span>
        </Button>
      </div>

      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
        {posts.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-colors",
              index === activeIndex
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            )}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
