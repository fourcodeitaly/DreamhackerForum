"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Award } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getPostsByTags } from "@/lib/db/posts/post-get";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";
import { useEffect, useState } from "react";
import { Post } from "@/lib/db/posts/posts-modify";
import { Skeleton } from "../ui/skeleton";

export function ScholarshipPosts() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<{ posts: Post[]; total: number }>({
    posts: [],
    total: 0,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await getPostsByTags(
        ["c34d416e-1bed-4474-a020-e83032e2b15d"],
        1,
        5
      );
      setPosts({ posts: posts.posts, total: posts.total });
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center">
          <Award className="h-4 w-4 mr-2 text-yellow-400" />
          <span className="animate-bounce">
            {t("scholarshipInformation").split(")")[1]}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : posts.posts.length > 0 ? (
            posts.posts.map((post) => (
              <div key={post.id} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 min-w-3" />
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-sm text-gray-600 hover:text-gray-900 block"
                  >
                    {post.title[language]}
                    {" ・ "}
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(post.created_at || ""), {
                        addSuffix: true,
                      })}
                    </span>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">{t("noPosts")}</div>
          )}
          <div className="pt-2 text-center">
            <Link
              href="/posts?tag=c34d416e-1bed-4474-a020-e83032e2b15d"
              className="text-sm text-primary hover:underline"
            >
              {t("viewAll")} →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
