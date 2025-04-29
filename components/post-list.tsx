"use client";

import { useState, useEffect } from "react";
import { PostCard } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { getPosts } from "@/lib/data-utils";
import type { Post } from "@/lib/db/posts";

interface PostListProps {
  initialPosts: Post[];
  categoryId?: string;
}

export function PostList({ initialPosts, categoryId }: PostListProps) {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Set initial state based on server-fetched posts
  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts);
      setHasMore(initialPosts.length >= 10);
    }
  }, [initialPosts]);

  // Handle loading more posts
  const loadMorePosts = async () => {
    const nextPage = page + 1;
    setIsLoading(true);

    try {
      const newPosts = await getPosts(nextPage, 10, categoryId);
      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(newPosts.length === 10);
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={loadMorePosts}
            disabled={isLoading}
          >
            {isLoading ? t("loading") : t("loadMore")}
          </Button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-muted-foreground mt-8">
          {t("noMorePosts")}
        </p>
      )}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noPosts")}</p>
        </div>
      )}
    </div>
  );
}
