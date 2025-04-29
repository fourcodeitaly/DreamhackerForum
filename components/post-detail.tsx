"use client"

import { useState } from "react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Bookmark, Heart, MessageCircle, Share2, Edit } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/hooks/use-language"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import { PostLanguageSwitcher } from "@/components/post-language-switcher"
import { normalizePostData } from "@/lib/data-utils"

interface PostDetailProps {
  post: any
}

export function PostDetail({ post: rawPost }: PostDetailProps) {
  const { t } = useTranslation()
  const { language } = useLanguage()
  const { user } = useAuth()

  // Normalize post data to ensure consistent structure
  const post = normalizePostData(rawPost)

  const [liked, setLiked] = useState(post.liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [saved, setSaved] = useState(post.saved || false)
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "zh" | "vi">(language)

  // Handle multilingual content
  const getLocalizedContent = () => {
    // Check if post has multilingual content structure
    if (post.content && typeof post.content === "object") {
      return post.content[currentLanguage] || post.content.en || ""
    }

    // Legacy format or fallback
    if (currentLanguage === "zh") {
      return post.content
        .split("\n")
        .map((paragraph: string) => `[中文] ${paragraph}`)
        .join("\n")
    } else if (currentLanguage === "vi") {
      return post.content
        .split("\n")
        .map((paragraph: string) => `[Tiếng Việt] ${paragraph}`)
        .join("\n")
    }
    return post.content
  }

  const getLocalizedTitle = () => {
    // Check if post has multilingual title structure
    if (post.title && typeof post.title === "object") {
      return post.title[currentLanguage] || post.title.en || ""
    }

    // Legacy format or fallback
    if (currentLanguage === "zh") {
      return `[中文] ${post.title}`
    } else if (currentLanguage === "vi") {
      return `[Tiếng Việt] ${post.title}`
    }
    return post.title
  }

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
    <Card className="overflow-hidden">
      <CardHeader className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.image || "/placeholder.svg"} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/profile/${post.author.username}`} className="text-base font-medium hover:underline">
                {post.author.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {post.isPinned && <Badge variant="outline">{t("pinned")}</Badge>}
          {user && user.id === post.author.id && (
            <Link href={`/posts/${post.id}/edit`}>
              <Button variant="outline" size="sm" className="ml-2">
                <Edit className="h-4 w-4 mr-2" />
                {t("edit")}
              </Button>
            </Link>
          )}
        </div>

        <PostLanguageSwitcher
          onLanguageChange={(lang) => setCurrentLanguage(lang as "en" | "zh" | "vi")}
          currentLanguage={currentLanguage}
        />

        <h1 className="text-3xl font-bold mb-3">{getLocalizedTitle()}</h1>

        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag: string) => (
            <Link href={`/tags/${tag}`} key={tag}>
              <Badge variant="secondary" className="hover:bg-secondary/80">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {post.image && (
          <div className="mb-6">
            <img
              src={post.image || "/placeholder.svg"}
              alt={post.title}
              className="rounded-md w-full max-h-96 object-cover"
            />
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          {getLocalizedContent()
            .split("\n")
            .map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>
      </CardContent>

      <CardFooter className="p-6 flex items-center justify-between border-t">
        <div className="flex space-x-6">
          <Button variant="ghost" size="sm" className="flex items-center space-x-2" onClick={handleLike}>
            <Heart className={cn("h-5 w-5", liked ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
            <span className={cn(liked ? "text-red-500" : "text-muted-foreground")}>
              {likesCount} {t("likes")}
            </span>
          </Button>

          <Link href="#comments">
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {post.commentsCount} {t("comments")}
              </span>
            </Button>
          </Link>
        </div>

        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="flex items-center space-x-2" onClick={handleShare}>
            <Share2 className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">{t("share")}</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center space-x-2" onClick={handleSave}>
            <Bookmark className={cn("h-5 w-5", saved ? "fill-current" : "text-muted-foreground")} />
            <span className="text-muted-foreground">{t("save")}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
