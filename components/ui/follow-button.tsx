"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/use-translation";
import { Loader2 } from "lucide-react";

interface FollowButtonProps {
  id: string;
  type: "user" | "category";
  initialFollowed: boolean;
  onFollowChange?: (followed: boolean) => void;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function FollowButton({
  id,
  type,
  initialFollowed,
  onFollowChange,
  variant = "default",
  size = "default",
  className,
}: FollowButtonProps) {
  const [isFollowed, setIsFollowed] = useState(initialFollowed);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleFollow = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await fetch(`/api/${type}s/${id}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: isFollowed ? "unfollow" : "follow",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("errorFollowing"));
      }

      setIsFollowed(!isFollowed);
      onFollowChange?.(!isFollowed);

      toast({
        title: t("success"),
        description: isFollowed
          ? t("unfollowedSuccessfully")
          : t("followedSuccessfully"),
      });
    } catch (error) {
      console.error("Error following:", error);
      toast({
        title: t("error"),
        description:
          error instanceof Error ? error.message : t("errorFollowing"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleFollow}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowed ? (
        t("following")
      ) : (
        t("follow")
      )}
    </Button>
  );
}
