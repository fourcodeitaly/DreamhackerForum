"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Star } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { getRecentActivities } from "@/lib/db/activities/activities-modify";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toCamelCase } from "@/utils/snake-case";

export function RecentActivities() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const recentActivities = await getRecentActivities(5);
        setActivities(recentActivities);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {t("recentActivities")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-4 w-4 mr-2 text-green-700" />
          {t("recentActivities")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="space-y-1">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <Link
                  href={`/posts?category=${activity.category.id}`}
                  className="text-sm text-gray-600 hover:text-gray-900 block"
                >
                  {activity.type === "post_created" && t("createdPost")}
                  {activity.type === "post_updated" && t("updatedPost")}
                  {activity.type === "post_deleted" && t("deletedPost")}
                  {activity.type === "comment_created" && t("commentedOn")}{" "}
                  <span className="font-semibold">
                    {activity.target && t(toCamelCase(activity.category_id))}
                  </span>
                  {" ・ "}
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(activity.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
