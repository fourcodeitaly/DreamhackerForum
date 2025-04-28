"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMockRelatedPosts } from "@/lib/mock-data"
import { useTranslation } from "@/hooks/use-translation"
import { formatDistanceToNow } from "date-fns"

interface RelatedPostsProps {
  currentPostId: string
}

export function RelatedPosts({ currentPostId }: RelatedPostsProps) {
  const { t } = useTranslation()
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])

  useEffect(() => {
    setRelatedPosts(getMockRelatedPosts(currentPostId))
  }, [currentPostId])

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
                  {post.image ? (
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      className="h-12 w-12 rounded-md object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-muted flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={post.author.image || "/placeholder.svg"} alt={post.author.name} />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
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
