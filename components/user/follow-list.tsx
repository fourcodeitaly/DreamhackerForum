"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  isFollowed?: boolean;
}

interface FollowListProps {
  userId: string;
  initialFollowers: User[];
  initialFollowing: User[];
  followersCount: number;
  followingCount: number;
}

export function FollowList({
  userId,
  initialFollowers,
  initialFollowing,
  followersCount,
  followingCount,
}: FollowListProps) {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [followers, setFollowers] = useState(initialFollowers);
  const [following, setFollowing] = useState(
    initialFollowing.map((user) => ({
      ...user,
      isFollowed: true,
    }))
  );

  const handleFollow = (userId: string, isFollowed: boolean) => {
    // Update followers list if the current user is in it
    setFollowers((prev) =>
      prev.map((user) =>
        user.id === currentUser?.id
          ? { ...user, isFollowed: !isFollowed }
          : user
      )
    );

    // Update following list if the target user is in it
    setFollowing((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isFollowed: !isFollowed } : user
      )
    );
  };

  return (
    <Tabs defaultValue="followers" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="followers">
          {t("followers")} ({followersCount})
        </TabsTrigger>
        <TabsTrigger value="following">
          {t("following")} ({followingCount})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="followers">
        {followers.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            {t("noFollowers")}
          </p>
        ) : (
          <div className="space-y-4">
            {followers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.image_url} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/profile/${user.username}`}
                      className="font-medium hover:underline"
                    >
                      {user.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </div>
                {currentUser && currentUser.id !== user.id && (
                  <FollowButton
                    id={user.id}
                    type="user"
                    initialFollowed={user.isFollowed ?? false}
                    onFollowChange={(isFollowed) =>
                      handleFollow(user.id, isFollowed)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="following">
        {following.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            {t("notFollowingAnyone")}
          </p>
        ) : (
          <div className="space-y-4">
            {following.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.image_url} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/profile/${user.username}`}
                      className="font-medium hover:underline"
                    >
                      {user.name}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </div>
                {currentUser && currentUser.id !== user.id && (
                  <FollowButton
                    id={user.id}
                    type="user"
                    initialFollowed={user.isFollowed ?? false}
                    onFollowChange={(isFollowed) =>
                      handleFollow(user.id, isFollowed)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
