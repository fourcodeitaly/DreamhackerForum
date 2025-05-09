"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { Calendar, MapPin, Settings } from "lucide-react";
import Link from "next/link";
import { ProfileEditForm } from "@/components/profile-edit-form";

interface UserProfileProps {
  user: any;
}

export function UserProfile({ user }: UserProfileProps) {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();

  const isCurrentUser = currentUser?.id === user.id;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage
                src={
                  user.image_url ||
                  "/placeholder.svg?height=128&width=128&query=user"
                }
                alt={user.name}
              />
              <AvatarFallback className="text-2xl">
                {user.name[0]}
              </AvatarFallback>
            </Avatar>

            {isCurrentUser && (
              <div className="mt-4 flex space-x-2">
                <ProfileEditForm user={user} />
                <Button variant="outline" size="sm" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {t("settings")}
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>

            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {user.badges &&
                user.badges.map((badge: any) => (
                  <Badge key={badge.id} variant="outline" className="px-2 py-1">
                    {badge.name}
                  </Badge>
                ))}
            </div>

            <div className="mt-6 space-y-2">
              {user.bio && <p>{user.bio}</p>}

              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {user.location}
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {t("joinedOn", {
                    date: new Date(user.joined_at).toLocaleDateString(),
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-6 justify-center md:justify-start">
              <div>
                <div className="text-2xl font-bold">{user.postsCount}</div>
                <div className="text-sm text-muted-foreground">
                  {t("posts")}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">{user.commentsCount}</div>
                <div className="text-sm text-muted-foreground">
                  {t("comments")}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">{user.likesReceived}</div>
                <div className="text-sm text-muted-foreground">
                  {t("likesReceived")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
