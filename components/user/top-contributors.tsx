"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, MessageSquare, ThumbsUp, Star } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useEffect, useState } from "react";
import { getTopContributors } from "@/lib/db/users/users-get";
import { Skeleton } from "../ui/skeleton";

interface Contributor {
  id: string;
  username: string;
  name: string;
  image_url: string | null;
  post_count: number;
  comment_count: number;
  total_likes: number;
  total_points: number;
  rank?: {
    id: string;
    name: string;
    min_points: number;
    frame_color: string;
  };
}

export function TopContributors() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [topContributors, setTopContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    const fetchTopContributors = async () => {
      const topContributors = await getTopContributors();
      setTopContributors(topContributors);
      setIsLoading(false);
    };
    fetchTopContributors();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
          {t("topContributors")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : topContributors.length > 0 ? (
            topContributors.map((user, index) => (
              <Link
                key={user.id}
                href={`/profile/${user.username}`}
                className="flex items-center space-x-4 p-2 rounded-md hover:bg-muted transition-colors"
              >
                <div className="relative">
                  <Avatar
                    className={`h-10 w-10 border-2 ${
                      user.rank?.frame_color
                        ? `border-[${user.rank.frame_color}]`
                        : "border-background"
                    }`}
                  >
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
                  <div className="text-sm">{user.name || user.username}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    {user.rank && (
                      <Badge
                        className="text-xs"
                        style={{ backgroundColor: user.rank.frame_color }}
                      >
                        <Star
                          className={`w-3 h-3 mr-1 ${
                            user.rank.name === "Captain" &&
                            "animate-spin transition-all duration-1000"
                          }`}
                        />
                        {user.rank.name}
                      </Badge>
                    )}
                    <div className="flex items-center text-xs">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      {user.post_count}
                    </div>
                    <div className="flex items-center text-xs">
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      {user.total_likes}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>{t("noContributorsFound")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
