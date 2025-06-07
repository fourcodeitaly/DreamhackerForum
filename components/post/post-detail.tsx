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
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  X,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";
import { cn, formatRelativeTime } from "@/utils/utils";
import { PostLanguageSwitcher } from "@/components/post/post-language-switcher";
import { normalizePostData } from "@/utils/data-utils";
import { Markdown } from "@/components/markdown"; // Import the Markdown component
import type { Post } from "@/lib/db/posts/posts-modify";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface PostDetailProps {
  post: Post;
}

export function PostDetail({ post: rawPost }: PostDetailProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const [post, setPost] = useState<Post>(rawPost);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [saved, setSaved] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "zh" | "vi">(
    "en"
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isAuthor = post.user_id === user?.id;

  useEffect(() => {
    if (rawPost) {
      const normalizedPost = normalizePostData(rawPost);
      setPost(normalizedPost);
      setLiked(normalizedPost.liked || false);
      setLikesCount(Number(normalizedPost.likes_count || "0"));
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

      return content.split("--------------------------------------")[0] || "";
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

  const handleLike = async () => {
    if (!user) return;

    // Optimistically update UI
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setLiked(liked);
        setLikesCount((prev) => (liked ? prev + 1 : prev - 1));
        throw new Error("Failed to update like status");
      }

      // Update with actual server data
    } catch (error) {
      console.error("Error liking post:", error);
      toast({
        title: t("error"),
        description: t("errorLikingPost"),
        variant: "destructive",
      });
    }
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
              <AvatarImage src={author.image_url || ""} alt={author.name} />
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
            {(isAuthor || isAdmin) && (
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

        <h1 className="text-2xl font-bold mb-3 pt-6">{getLocalizedTitle()}</h1>

        {/* Display the original link if available */}
        {/* {post.event && (
          <a
            href={`/events/${post.event.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-primary hover:underline mb-4"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            {t("originalSource") || "Original Source"}
          </a>
        )} */}

        <div className="flex flex-wrap gap-2 mt-4">
          {(post.tags || []).map((tag: { name: string; id: string }) => (
            <Link href={`/posts?tag=${tag.id}`} key={tag.id}>
              <Badge variant="secondary" className="hover:bg-secondary/80">
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0 md:p-6">
        {post.event && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              {t("upcomingEvents").split(")")[1]}
            </h2>
          </div>
        )}

        {post.event && (
          <Link href={`/events/${post.event.id}`} key={post.event.id}>
            <Card className="p-4 hover:shadow-md transition-all group my-4">
              <div className="flex justify-between items-start w-full">
                <div className="flex gap-4 w-full">
                  {post.event.images && post.event.images.length > 0 && (
                    <div className="w-24 h-24 flex-shrink-0 hidden md:block">
                      <img
                        src={
                          post.event.images.find(
                            (image) => image.display_order === 0
                          )?.image_url
                        }
                        alt={post.event.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="space-y-2 w-full">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium group-hover:text-primary transition-colors">
                        {post.event.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "capitalize",
                            post.event.type === "workshop" &&
                              "bg-blue-100 text-blue-800",
                            post.event.type === "seminar" &&
                              "bg-green-100 text-green-800",
                            post.event.type === "conference" &&
                              "bg-purple-100 text-purple-800"
                          )}
                        >
                          {post.event.type}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {format(
                          new Date(post.event.start_date),
                          "MMM d, yyyy"
                        )}{" "}
                        at {format(new Date(post.event.start_date), "h:mm a")}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {post.event.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        )}

        <div className="prose prose-sm dark:prose-invert max-w-none">
          {/* Upcoming Events Section */}

          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 my-6">
              {post.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square group cursor-pointer"
                  onClick={() => setSelectedImage(image.image_url)}
                >
                  <img
                    src={image.image_url}
                    alt="Post image"
                    className="w-full h-full object-cover rounded-lg m-0"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Post Content */}
          <Markdown content={getLocalizedContent()} />
        </div>
      </CardContent>

      {/* Image Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl w-full p-0">
          <div className="relative">
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Full size image"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
            <DialogClose asChild>
              <div className="absolute top-2 right-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      <CardFooter className="p-0 pt-4 md:p-6 flex items-center justify-between border-t">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 group"
          onClick={handleLike}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-all duration-200 ease-in-out",
              liked
                ? "fill-red-500 text-red-500 scale-110"
                : "text-muted-foreground group-hover:scale-125"
            )}
          />
          <span
            className={cn(
              "transition-all duration-200 ease-in-out",
              liked ? "text-red-500" : "text-muted-foreground"
            )}
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
          <span className="text-muted-foreground">{t("share")}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
