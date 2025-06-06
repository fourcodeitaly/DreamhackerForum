import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Award } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getServerLanguage, getServerTranslation } from "@/lib/get-translation";
import { getPostsByTags } from "@/lib/db/posts/post-get";

export async function ScholarshipPosts() {
  const { t } = await getServerTranslation();
  const language = await getServerLanguage();

  const posts = await getPostsByTags(
    ["c34d416e-1bed-4474-a020-e83032e2b15d"],
    1,
    5
  );

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
          {posts.posts.length > 0 ? (
            posts.posts.map((post) => (
              <div key={post.id} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400 min-w-3" />
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-sm dark:text-gray-300 hover:text-primary block"
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
