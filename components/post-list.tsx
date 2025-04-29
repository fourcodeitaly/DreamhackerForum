"use client"

import { useState, useEffect } from "react"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { getPosts } from "@/lib/db/posts"
import type { Post } from "@/lib/db/posts"

interface PostListProps {
  initialPosts?: Post[]
  categoryId?: string
}

export function PostList({ initialPosts, categoryId }: PostListProps) {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<Post[]>(initialPosts || [])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts)
      setHasMore(initialPosts.length >= 10)
      return
    }

    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const fetchedPosts = await getPosts(page, 10, categoryId)
        setPosts((prev) => (page === 1 ? fetchedPosts : [...prev, ...fetchedPosts]))
        setHasMore(fetchedPosts.length === 10)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [page, initialPosts, categoryId])

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={() => setPage((prev) => prev + 1)} disabled={isLoading}>
            {isLoading ? t("loading") : t("loadMore")}
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
