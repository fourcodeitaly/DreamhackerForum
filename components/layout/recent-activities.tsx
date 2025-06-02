"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Star } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toCamelCase } from "@/utils/snake-case";
import { useTranslation } from "@/hooks/use-translation";
import { Activity } from "@/lib/db/activities/activities-modify";
import { Skeleton } from "../ui/skeleton";

export function RecentActivities() {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await fetch("/api/activities");

      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }

      const activities = (await response.json()) as Activity[];

      setActivities(activities);
      setIsLoading(false);
    };
    fetchActivities();
  }, []);

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
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <Link
                    href={`/posts?category=${activity.category_id}`}
                    className="text-sm dark:text-gray-300 hover:text-primary block"
                  >
                    {activity.type === "post_created" && t("createdPost")}
                    {activity.type === "post_updated" && t("updatedPost")}
                    {activity.type === "post_deleted" && t("deletedPost")}
                    {activity.type === "comment_created" &&
                      t("commentedOn")}{" "}
                    <span className="font-semibold">
                      {t(toCamelCase(activity.category_id || ""))}
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
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>{t("noActivitiesFound")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
