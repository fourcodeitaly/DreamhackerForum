"use client"

import { useState } from "react"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"

interface UserPostsProps {
  username: string
  initialPosts: any[]
  totalPosts?: number
}

export function UserPosts({ username, initialPosts, totalPosts }: UserPostsProps) {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<any[]>(initialPosts)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // useEffect(() => {
  //   // Simulate fetching posts with pagination
  //   const fetchPosts = () => {
  //     const newPosts = getMockUserPosts(username, page, 5);
  //     setPosts((prev) => [...prev, ...newPosts]);
  //     setHasMore(newPosts.length === 5);
  //   };

  //   fetchPosts();
  // }, [username, page]);

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
              <Button variant="outline" onClick={() => setPage((prev) => prev + 1)}>
                {t("loadMore")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
