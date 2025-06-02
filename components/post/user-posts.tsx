"use client";

import { useState } from "react";
import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { Loader2 } from "lucide-react";

interface UserPostsProps {
  userId: string;
  initialPosts: any[];
  totalPosts?: number;
}

export function UserPosts({
  userId,
  initialPosts,
  totalPosts,
}: UserPostsProps) {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/posts/user/${userId}?page=${page}&limit=5`
      );
      if (!response.ok) throw new Error("Failed to fetch posts");

      const newPosts = await response.json();
      setPosts((prev) => {
        // Filter out any posts that already exist in the previous state
        const uniqueNewPosts = newPosts.filter(
          (newPost: any) =>
            !prev.some((prevPost: any) => prevPost.id === newPost.id)
        );
        return [...prev, ...uniqueNewPosts];
      });
      setHasMore(newPosts.length === 5);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">{t("noPostsYet")}</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={fetchPosts}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {t("loadMore")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
