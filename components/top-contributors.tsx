"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, MessageSquare, ThumbsUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";

interface Contributor {
  id: string;
  username: string;
  name: string;
  image_url: string | null;
  post_count: number;
  comment_count: number;
  total_likes: number;
}

export function TopContributors({
  topContributors,
}: {
  topContributors: Contributor[];
}) {
  const { t } = useTranslation();

  if (topContributors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
            {t("topContributors", { count: 5 })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p>No contributors found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          {t("topContributors", { count: 5 })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topContributors.map((user, index) => (
            <Link
              key={user.id}
              href={`/profile/${user.username}`}
              className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted transition-colors"
            >
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-background">
                  <AvatarImage
                    src={
                      user.image_url ||
                      "/placeholder.svg?height=40&width=40&query=user"
                    }
                    alt={user.name || user.username}
                  />
                  <AvatarFallback>
                    {(user.name || user.username)?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {index < 3 && (
                  <Badge
                    className={`absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                        ? "bg-gray-400"
                        : "bg-amber-700"
                    }`}
                  >
                    {index + 1}
                  </Badge>
                )}
              </div>
              <div>
                <div className="font-medium">{user.name || user.username}</div>
                <div className="text-xs text-muted-foreground">
                  @{user.username}
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center text-xs">
                    <MessageSquare className="mr-1 h-3 w-3" />
                    {user.post_count + user.comment_count}
                  </div>
                  <div className="flex items-center text-xs">
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    {user.total_likes}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
