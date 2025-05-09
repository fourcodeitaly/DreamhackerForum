"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "@/hooks/use-translation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/markdown";
// import { formatRelativeTime } from "@/lib/utils"
import { MessageSquare, Eye, ExternalLink } from "lucide-react";
import type { Post } from "@/lib/db/posts/posts-modify";

interface PostCardProps {
  post: Post;
  onDelete?: () => void;
}

export function PostCard({ post, onDelete }: PostCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const isAuthor = user && post.user_id === user.id;
  const isAdmin = user && user.role === "admin";

  const handleEdit = () => {
    router.push(`/posts/${post.id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm(t("confirm_delete_post"))) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/posts/${post.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          if (onDelete) {
            onDelete();
          }
        } else {
          console.error("Failed to delete post");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const postContent = post.content?.[language] || post.content?.en || "";
  const postTitle = post.title?.[language] || post.title?.en || "";

  return (
    <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Link href={`/posts/${post.id}`}>
            <h2 className="text-xl font-bold hover:underline">{postTitle}</h2>
          </Link>
          {(isAuthor || isAdmin) && (
            <div className="flex space-x-2">
              {/* <Button variant="outline" size="sm" onClick={handleEdit}>
              {t("edit")}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? t("deleting") : t("delete")}
            </Button> */}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage
              src={
                post.author?.image_url || "https://i.redd.it/o1unzd4c5bu71.png"
              }
              alt={post.author?.username || ""}
            />
            <AvatarFallback>
              {post.author?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              href={`/profile/${post.author?.username}`}
              className="text-sm font-medium hover:underline"
            >
              {post.author?.username}
            </Link>
            <p className="text-xs text-muted-foreground">
              {/* {formatRelativeTime(new Date(post.created_at || ""))} */}
            </p>
          </div>
        </div>
        {post.category && (
          <div>
            <Link href={`/categories/${post.category_id}`}>
              <Badge variant="outline" className="hover:bg-accent">
                {post.category.name.en}
              </Badge>
            </Link>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* {post.image_url && (
        <Link href={`/posts/${post.id}`}>
          <div className="mb-4 overflow-hidden rounded-md">
            <Image
              src={post.image_url || "/placeholder.svg"}
              alt={postTitle}
              width={400}
              height={200}
              className="w-full h-48 object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>
      )} */}
        <Link href={`/posts/${post.id}`}>
          <div className="text-sm text-muted-foreground line-clamp-3">
            <Markdown content={postContent} preview={true} />
          </div>
        </Link>
        {post.original_link && (
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <a
              href={post.original_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              {t("original_source")}
            </a>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <Eye className="mr-1 h-4 w-4" />
          {post.view_count || 0}
        </div>
        <div className="flex items-center">
          <MessageSquare className="mr-1 h-4 w-4" />
          {post.comments_count || 0}
        </div>
      </CardFooter>
    </Card>
  );
}
