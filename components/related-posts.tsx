"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/hooks/use-language"
import { getRelatedPosts } from "@/lib/data-utils"
import type { Post } from "@/lib/db/posts"

interface RelatedPostsProps {
  postId?: string
  currentPostId?: string // Support both naming conventions
  categoryId?: string | null
  initialPosts?: Post[]
}

export function RelatedPosts({ postId, currentPostId, categoryId, initialPosts = [] }: RelatedPostsProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(!initialPosts.length)
  const [error, setError] = useState<string | null>(null)

  // Use postId if provided, otherwise use currentPostId
  const effectivePostId = postId || currentPostId

  useEffect(() => {
    // If we don't have initial posts, fetch them
    if (!initialPosts.length && effectivePostId) {
      fetchRelatedPosts()
    }
  }, [effectivePostId, categoryId, initialPosts.length])

  const fetchRelatedPosts = async () => {
    if (!effectivePostId) {
      setError("No post ID provided")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const relatedPosts = await getRelatedPosts(effectivePostId, categoryId)
      setPosts(relatedPosts)
    } catch (error) {
      console.error("Error fetching related posts:", error)
      setError("Failed to load related posts")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{t("related_posts")}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700 mb-2"></div>
                <div className="h-3 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{t("related_posts")}</h2>
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={fetchRelatedPosts}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {t("try_again")}
          </button>
        </Card>
      </div>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{t("related_posts")}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          // Handle both multilingual and regular title formats
          const title =
            typeof post.title === "object"
              ? post.title?.[language] || post.title?.en || t("untitled_post")
              : post.title || t("untitled_post")

          const excerpt =
            post.excerpt && typeof post.excerpt === "object"
              ? post.excerpt[language] || post.excerpt.en || ""
              : typeof post.excerpt === "string"
                ? post.excerpt
                : ""

          return (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <Card className="h-full hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <h3 className="font-medium line-clamp-2">{title}</h3>
                  {excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{excerpt}</p>}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{t("read_more")}</p>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
