"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslation } from "@/hooks/use-translation"
import { formatRelativeTime } from "@/lib/utils"
import { getPosts } from "@/lib/data-utils"

interface RelatedPostsProps {
  currentPostId: string
}

export function RelatedPosts({ currentPostId }: RelatedPostsProps) {
  const { t } = useTranslation()
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        // Fetch posts and filter out the current one
        const posts = await getPosts(1, 5)
        const filtered = posts.filter((post) => post.id !== currentPostId)
        setRelatedPosts(filtered.slice(0, 3))
      } catch (error) {
        console.error("Error fetching related posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedPosts()
  }, [currentPostId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("relatedPosts")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="h-12 w-12 rounded-md bg-muted flex-shrink-0" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("relatedPosts")}</CardTitle>
      </CardHeader>
      <CardContent>
        {relatedPosts.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">{t("noRelatedPosts")}</p>
        ) : (
          <div className="space-y-4">
            {relatedPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="block group">
                <div className="flex items-start space-x-3">
                  {post.image_url ? (
                    <img
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.title?.en || ""}
                      className="h-12 w-12 rounded-md object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-muted flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title?.en || ""}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={post.author?.image_url || "/placeholder.svg"} alt={post.author?.name || ""} />
                        <AvatarFallback>{post.author?.name?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">{formatRelativeTime(post.created_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
