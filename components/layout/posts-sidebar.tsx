"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/hooks/use-auth";
import { PlusCircle, TrendingUp, Users, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PostsSidebar() {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();

  // Mock data for trending topics
  const trendingTopics = [
    { name: "MBA Application Tips", count: 45 },
    { name: "Interview Preparation", count: 38 },
    { name: "Resume Writing", count: 32 },
    { name: "Essay Guidelines", count: 29 },
  ];

  // Mock data for active users
  const activeUsers = [
    { name: "John Doe", posts: 12 },
    { name: "Jane Smith", posts: 8 },
    { name: "Mike Johnson", posts: 6 },
  ];

  return (
    <div className="space-y-6">
      {/* Create Post Button */}
      {isAdmin && (
        <Button asChild variant="default" className="w-full justify-start">
          <Link href="/create-post">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("createPost")}
          </Link>
        </Button>
      )}

      {/* Trending Topics */}
      <Card className="hidden md:block">
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t("trendingTopics")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {trendingTopics.map((topic) => (
              <div
                key={topic.name}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-muted-foreground">{topic.name}</span>
                <Badge variant="secondary">{topic.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="hidden md:block">
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {t("activeUsers")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {activeUsers.map((user) => (
              <div
                key={user.name}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-muted-foreground">{user.name}</span>
                <Badge variant="secondary">{user.posts} posts</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="hidden md:block">
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {t("recentActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>New post in MBA Rankings</div>
            <div>3 new comments in Interview Tips</div>
            <div>New user joined the forum</div>
            <div>Updated FAQ section</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
