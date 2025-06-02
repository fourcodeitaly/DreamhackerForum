"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { Calendar, MapPin, Settings, Star, GraduationCap } from "lucide-react";
import { ProfileEditForm } from "@/components/user/profile-edit-form";
import { FollowButton } from "@/components/ui/follow-button";
import { User } from "@/lib/db/users/users-get";

interface UserProfileProps {
  user: User;
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
            <div className="relative">
              <Avatar
                className={`h-24 w-24 md:h-32 md:w-32 border-4 ${
                  user.rank?.frame_color
                    ? `border-[${user.rank.frame_color}]`
                    : "border-muted"
                }`}
              >
                <AvatarImage
                  src={
                    user.image_url ||
                    "https://i.pinimg.com/280x280_RS/5e/b4/db/5eb4dbcf9466c57fd8e566a6088bf626.jpg"
                  }
                  alt={user.name}
                />
                <AvatarFallback className="text-2xl">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
              {user.rank && (
                <Badge
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1"
                  style={{ backgroundColor: user.rank.frame_color }}
                >
                  <Star className="w-3 h-3 mr-1" />
                  {user.rank.name}
                </Badge>
              )}
            </div>

            {isCurrentUser ? (
              <div className="mt-4 flex space-x-2">
                <ProfileEditForm user={user} />
                {/* <Button variant="outline" size="sm" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    {t("settings")}
                  </Link>
                </Button> */}
              </div>
            ) : (
              <div className="mt-4">
                <FollowButton
                  id={user.id}
                  type="user"
                  initialFollowed={user.isFollowed ?? false}
                />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>

            {user.rank && (
              <div className="mt-2 text-sm text-muted-foreground">
                {t("totalPoints", { points: user.total_points })}
              </div>
            )}

            <div className="mt-2 space-y-2">
              {user.bio && <p>{user.bio}</p>}

              <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                {user.location && (
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    {user.location}
                  </div>
                )}

                {/* <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  {t("joinedOn", {
                    date: new Date(user.joined_at).toLocaleDateString(),
                  })}
                </div> */}
              </div>
            </div>

            {/* Education Section */}
            {user.educations && user.educations.length > 0 && (
              <div>
                {/* <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  {t("education")}
                </h3> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.educations.map((education, index) => (
                    <div
                      key={education.id}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <div className="font-medium">{education.school_name}</div>
                      {(education.degree || education.field_of_study) && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {education.degree}
                          {education.degree &&
                            education.field_of_study &&
                            " in "}
                          {education.field_of_study}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground mt-1">
                        {education.start_date &&
                          new Date(education.start_date).getFullYear()}
                        {education.start_date && education.end_date && " - "}
                        {education.is_current
                          ? t("present")
                          : education.end_date &&
                            new Date(education.end_date).getFullYear()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
              <div>
                <div className="text-2xl font-bold">{user.followers_count}</div>
                <div className="text-sm text-muted-foreground">
                  {t("followers")}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold">{user.following_count}</div>
                <div className="text-sm text-muted-foreground">
                  {t("following")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
