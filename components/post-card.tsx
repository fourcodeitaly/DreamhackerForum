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
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: any
}

export function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [liked, setLiked] = useState(post.liked || false)
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)
  const [saved, setSaved] = useState(post.saved || false)

  const handleLike = () => {
    if (!user) return

    if (liked) {
      setLikesCount((prev) => prev - 1)
    } else {
      setLikesCount((prev) => prev + 1)
    }
    setLiked(!liked)
  }

  const handleSave = () => {
    if (!user) return
    setSaved(!saved)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
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
              <AvatarImage src={post.author.image || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/profile/${post.author.username}`} className="text-sm font-medium hover:underline">
                {post.author.name}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {post.isPinned && (
            <Badge variant="outline" className="text-xs">
              {t("pinned")}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <Link href={`/posts/${post.id}`} className="block group">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
        </Link>

        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags.map((tag: string) => (
            <Link href={`/tags/${tag}`} key={tag}>
              <Badge variant="secondary" className="hover:bg-secondary/80">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>

        {post.image && (
          <Link href={`/posts/${post.id}`} className="block mt-4">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
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
              <span className="text-muted-foreground">{post.commentsCount}</span>
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
