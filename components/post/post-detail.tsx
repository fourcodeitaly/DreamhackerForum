"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";
import { cn, formatRelativeTime } from "@/utils/utils";
import { PostLanguageSwitcher } from "@/components/post/post-language-switcher";
import { normalizePostData } from "@/utils/data-utils";
import { Markdown } from "@/components/markdown"; // Import the Markdown component
import type { Post } from "@/lib/db/posts/posts-modify";

interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post: rawPost }: PostDetailProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { user, isAdmin } = useAuth();

  const [post, setPost] = useState<Post>(rawPost);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "zh" | "vi">(
    "en"
  );

  useEffect(() => {
    if (rawPost) {
      const normalizedPost = normalizePostData(rawPost);
      setPost(normalizedPost);
      setLiked(normalizedPost.liked || false);
      setLikesCount(normalizedPost.likes_count || 0);
      setSaved(normalizedPost.saved || false);
      setCurrentLanguage(language);
    }
  }, [rawPost, language]);

  // Handle case where post might be null or undefined
  if (!post) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="p-6">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-gray-700">
              Post not found
            </h2>
            <p className="text-gray-500 mt-2">
              The post you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </CardHeader>
      </Card>
    );
  }

  // Handle multilingual content
  const getLocalizedContent = () => {
    // Check if post has multilingual content structure
    if (post.content && typeof post.content === "object") {
      let content = post.content[currentLanguage] || post.content.en || "";

      // Remove first line if it starts with #
      content = content
        .split("\n")
        .filter((line, index) => {
          // Keep all lines except the first one that starts with #
          return index !== 0 || !line.trim().startsWith("#");
        })
        .join("\n");

      return content;
    }

    // Legacy format or fallback
    if (currentLanguage === "zh") {
      return post.content
        ? (post.content as string)
            .split("\n")
            .filter(
              (line, index) => index !== 0 || !line.trim().startsWith("#")
            )
            .map((paragraph: string) => `[中文] ${paragraph}`)
            .join("\n")
        : "";
    } else if (currentLanguage === "vi") {
      return post.content
        ? (post.content as string)
            .split("\n")
            .filter(
              (line, index) => index !== 0 || !line.trim().startsWith("#")
            )
            .map((paragraph: string) => `[Tiếng Việt] ${paragraph}`)
            .join("\n")
        : "";
    }
    return post.content || "";
  };

  const getLocalizedTitle = () => {
    // Check if post has multilingual title structure
    if (post.title && typeof post.title === "object") {
      return post.title[currentLanguage] || "";
    }

    // Legacy format or fallback
    if (currentLanguage === "zh") {
      return post.title ? `[中文] ${post.title}` : "";
    } else if (currentLanguage === "vi") {
      return post.title ? `[Tiếng Việt] ${post.title}` : "";
    }
    return post.title || "";
  };

  const handleLike = () => {
    if (!user) return;

    if (liked) {
      setLikesCount((prev) => prev - 1);
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaved((prev) => !prev);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          action: saved ? "unsave" : "save",
        }),
      });

      if (!response.ok) {
        setSaved((prev) => !prev);
        throw new Error("Failed to update saved status");
      }
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: getLocalizedTitle(),
        text: post.excerpt
          ? post.excerpt[currentLanguage] || post.excerpt.en
          : "",
        url: `/posts/${post.id}`,
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(
        window.location.origin + `/posts/${post.id}`
      );
      alert(t("linkCopied"));
    }
  };

  // Ensure author exists with fallbacks
  const author = post.author || {
    name: "Unknown Author",
    username: "unknown",
    image_url: null,
  };

  return (
    <Card className="overflow-hidden p-0 border-0 md:border shadow-none">
      <CardHeader className="p-0 md:p-6 pb-0 md:pb-0">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  author.image_url ||
                  "/placeholder.svg?height=40&width=40&query=user"
                }
                alt={author.name}
              />
              <AvatarFallback>
                {author.name ? author.name[0] : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link
                href={`/profile/${author.username || "unknown"}`}
                className="text-sm font-medium hover:underline"
              >
                {author.name || "Unknown Author"}
              </Link>
              <p className="text-sm text-muted-foreground">
                {formatRelativeTime(post.created_at || new Date())}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {post.is_pinned && <Badge variant="outline">{t("pinned")}</Badge>}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={handleSave}
            >
              <Bookmark
                className={cn(
                  "h-5 w-5",
                  saved
                    ? "fill-current text-yellow-500"
                    : "text-muted-foreground"
                )}
              />
              <span className="text-muted-foreground hidden md:block">
                {t("save")}
              </span>
            </Button>
            {isAdmin && (
              <Link href={`/posts/${post.id}/edit`}>
                <Button variant="outline" size="sm" className="ml-2">
                  <Edit className="h-4 w-4 mr-2" />
                  {t("edit")}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Restore the language switcher */}
        <PostLanguageSwitcher
          onLanguageChange={(lang) =>
            setCurrentLanguage(lang as "en" | "zh" | "vi")
          }
          currentLanguage={currentLanguage}
        />

        <h1 className="text-3xl font-bold mb-3 pt-6">{getLocalizedTitle()}</h1>

        {/* Display the original link if available */}
        {post.original_link && (
          <a
            href={post.original_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-primary hover:underline mb-4"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            {t("originalSource") || "Original Source"}
          </a>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {(post.tags || []).map((tag: string) => (
            <Link href={`/tags/${tag}`} key={tag}>
              <Badge variant="secondary" className="hover:bg-secondary/80">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0 md:p-6">
        {post.image_url && (
          <div className="mb-6">
            <img
              src={
                post.image_url ||
                "/placeholder.svg?height=400&width=800&query=post"
              }
              alt={getLocalizedTitle()}
              className="rounded-md w-full max-h-96 object-cover"
            />
          </div>
        )}

        <div className="prose dark:prose-invert max-w-none">
          {/* Render markdown content */}
          <Markdown content={getLocalizedContent()} />
        </div>
      </CardContent>

      <CardFooter className="p-0 pt-4 md:p-6 flex items-center justify-between border-t">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2"
          onClick={handleLike}
        >
          <Heart
            className={cn(
              "h-5 w-5",
              liked ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )}
          />
          <span
            className={cn(liked ? "text-red-500" : "text-muted-foreground")}
          >
            {likesCount} {t("likes")}
          </span>
        </Button>

        <Link href="#comments">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-muted-foreground">
              {post.comments_count || 0} {t("comments")}
            </span>
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground hidden md:block">
            {t("share")}
          </span>
        </Button>
      </CardFooter>
    </Card>
  );
}
