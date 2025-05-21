"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Award } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getPostsByTags } from "@/lib/db/posts/post-get";
import { Post } from "@/lib/db/posts/posts-modify";
import { useLanguage } from "@/hooks/use-language";

export function SchoolarshipPosts() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const scholarshipPosts = await getPostsByTags(["scls"], 1, 5);
        setPosts(scholarshipPosts.posts);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
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
          {posts.map((post) => (
            <div key={post.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400 min-w-3" />
                <Link
                  href={`/posts?category=${post.category?.id}`}
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
          ))}
          <div className="pt-2 text-center">
            <Link
              href="/posts?tags=us"
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
