"use client";

import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { RecentActivities } from "./recent-activities";
import { ScholarshipPosts } from "./scholarship-posts";
import { CategoryNavigation } from "./category-navigation";

export function PostsSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();

  useEffect(() => {}, [pathname]);

  // Mock data for trending topics
  const trendingTopics = [
    { name: "MBA Application Tips", count: 45 },
    { name: "Interview Preparation", count: 38 },
    { name: "Resume Writing", count: 32 },
    { name: "Essay Guidelines", count: 29 },
  ];

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <CategoryNavigation className="flex-wrap" />
      </div>
      {/* Scholarships */}
      <ScholarshipPosts />

      {/* Recent Activities */}
      <RecentActivities />

      {/* Trending Topics */}
      <Card className="hidden lg:block">
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-red-700" />
            {t("trendingTopics")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-1"
              >
                <span className="text-sm">{topic.name}</span>
                <Badge variant="secondary">{topic.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
