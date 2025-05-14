"use client";

import { useState } from "react";
import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import type { Post } from "@/lib/db/posts/posts-modify";

interface UserSavedPostsProps {
  savedPosts: Post[];
}

export function UserSavedPosts({ savedPosts }: UserSavedPostsProps) {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>(savedPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">{t("noSavedPostsYet")}</p>
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
                onClick={() => setPage((prev) => prev + 1)}
              >
                {t("loadMore")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
