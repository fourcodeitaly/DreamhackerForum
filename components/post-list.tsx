"use client"

import { useState, useEffect } from "react"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { getMockPosts } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"

interface PostListProps {
  initialPosts?: any[]
}

export function PostList({ initialPosts }: PostListProps) {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<any[]>(initialPosts || [])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts)
      setHasMore(initialPosts.length >= 10)
      return
    }

    // Simulate fetching posts with pagination
    const fetchPosts = () => {
      const newPosts = getMockPosts(page, 10)
      setPosts((prev) => [...prev, ...newPosts])
      setHasMore(newPosts.length === 10)
    }

    fetchPosts()
  }, [page, initialPosts])

  return (
    <div className="space-y-6">
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

      {!hasMore && posts.length > 0 && <p className="text-center text-muted-foreground mt-8">{t("noMorePosts")}</p>}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("noPosts")}</p>
        </div>
      )}
    </div>
  )
}
