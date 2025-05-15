"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/hooks/use-translation";
import { FollowButton } from "@/components/ui/follow-button";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  username: string;
  image_url?: string;
}

interface CategoryFollowersProps {
  categoryId: string;
  initialFollowers: User[];
  followersCount: number;
}

export function CategoryFollowers({
  categoryId,
  initialFollowers,
  followersCount,
}: CategoryFollowersProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [followers, setFollowers] = useState(initialFollowers);

  const handleFollowChange = (targetId: string, followed: boolean) => {
    // Update followers list if the current user follows/unfollows
    if (user?.id === targetId) {
      setFollowers((prev) =>
        followed
          ? [
              ...prev,
              {
                id: user.id,
                name: user.name,
                username: user.username,
                image_url: user.image_url,
              },
            ]
          : prev.filter((f) => f.id !== user.id)
      );
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {t("followers")} ({followersCount})
      </h3>
      {followers.length === 0 ? (
        <p className="text-center text-muted-foreground">{t("noFollowers")}</p>
      ) : (
        followers.map((follower) => (
          <div
            key={follower.id}
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <Link
              href={`/users/${follower.username}`}
              className="flex items-center gap-3 hover:underline"
            >
              <Avatar>
                <AvatarImage src={follower.image_url} />
                <AvatarFallback>
                  {follower.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{follower.name}</p>
                <p className="text-sm text-muted-foreground">
                  @{follower.username}
                </p>
              </div>
            </Link>
            {user && user.id !== follower.id && (
              <FollowButton
                id={follower.id}
                type="user"
                initialFollowed={false}
                onFollowChange={(isFollowed) =>
                  handleFollowChange(follower.id, isFollowed)
                }
                variant="outline"
                size="sm"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}
