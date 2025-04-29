"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/hooks/use-language"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { likePostAction, savePostAction } from "@/app/actions"
import { normalizePostData } from "@/lib/data-utils"
import type { Post } from "@/lib/db/posts"

interface PostCardProps {
  post: Post
}

export function PostCard({ post: rawPost }: PostCardProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { user } = useAuth()

  // Normalize post data to ensure consistent structure
  const post = normalizePostData(rawPost)

  const [liked, setLiked] = useState(post.liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [saved, setSaved] = useState(post.saved || false)

  // Get localized content based on current language
  const getLocalizedTitle = () => {
    if (typeof post.title === "object") {
      return post.title[language] || post.title.en || ""
    }
    return post.title
  }

  const getLocalizedExcerpt = () => {
    if (post.excerpt && typeof post.excerpt === "object") {
      return post.excerpt[language] || post.excerpt.en || ""
    }

    // If no excerpt, generate from content
    if (typeof post.content === "object") {
      const content = post.content[language] || post.content.en || ""
      return content.substring(0, 150) + (content.length > 150 ? "..." : "")
    }

    return ""
  }

  const handleLike = async () => {
    if (!user) return

    try {
      const result = await likePostAction(post.id, user.id)

      if (result.success) {
        if (result.liked) {
          setLikesCount((prev) => prev + 1)
        } else {
          setLikesCount((prev) => prev - 1)
        }
        setLiked(result.liked)
      }
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleSave = async () => {
    if (!user) return

    try {
      const result = await savePostAction(post.id, user.id)

      if (result.success) {
        setSaved(result.saved)
      }
    } catch (error) {
      console.error("Error saving post:", error)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: getLocalizedTitle(),
        text: getLocalizedExcerpt(),
        url: `/posts/${post.id}`,
      })
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.origin + `/posts/${post.id}`)
      alert(t("linkCopied"))
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.author?.image_url || "/placeholder.svg"} alt={post.author?.name} />
              <AvatarFallback>{post.author?.name?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/profile/${post.author?.username}`} className="text-sm font-medium hover:underline">
                {post.author?.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {post.is_pinned && (
            <Badge variant="outline" className="text-xs">
              {t("pinned")}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <Link href={`/posts/${post.id}`} className="block group">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {getLocalizedTitle()}
          </h3>
          <p className="text-muted-foreground line-clamp-2 mb-3">{getLocalizedExcerpt()}</p>
        </Link>

        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags?.map((tag) => (
            <Link href={`/tags/${tag}`} key={tag}>
              <Badge variant="secondary" className="hover:bg-secondary/80">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>

        {post.image_url && (
          <Link href={`/posts/${post.id}`} className="block mt-4">
            <img
              src={post.image_url || "/placeholder.svg"}
              alt={getLocalizedTitle()}
              className="rounded-md w-full h-48 object-cover"
            />
          </Link>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex space-x-4">
          <Button variant="ghost" size="sm" className="flex items-center space-x-1 h-8 px-2" onClick={handleLike}>
            <Heart className={cn("h-4 w-4", liked ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
            <span className={cn(liked ? "text-red-500" : "text-muted-foreground")}>{likesCount}</span>
          </Button>

          <Link href={`/posts/${post.id}#comments`}>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1 h-8 px-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{post.comments_count}</span>
            </Button>
          </Link>
        </div>

        <div className="flex space-x-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
            <Share2 className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">{t("share")}</span>
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSave}>
            <Bookmark className={cn("h-4 w-4", saved ? "fill-current" : "text-muted-foreground")} />
            <span className="sr-only">{t("save")}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
