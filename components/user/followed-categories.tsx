"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { FollowButton } from "@/components/ui/follow-button";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  followers_count: number;
}

interface FollowedCategoriesProps {
  userId: string;
  initialCategories: Category[];
}

export function FollowedCategories({
  userId,
  initialCategories,
}: FollowedCategoriesProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [categories, setCategories] = useState(initialCategories);

  const handleFollowChange = (categoryId: string, followed: boolean) => {
    setCategories((prev) =>
      followed
        ? prev.map((cat) =>
            cat.id === categoryId
              ? { ...cat, followers_count: cat.followers_count + 1 }
              : cat
          )
        : prev.map((cat) =>
            cat.id === categoryId
              ? {
                  ...cat,
                  followers_count: Math.max(0, cat.followers_count - 1),
                }
              : cat
          )
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("followedCategories")}</h3>
      {categories.length === 0 ? (
        <p className="text-center text-muted-foreground">
          {t("notFollowingCategories")}
        </p>
      ) : (
        categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-4 rounded-lg border"
          >
            <Link
              href={`/categories/${category.slug}`}
              className="flex-1 hover:underline"
            >
              <div>
                <p className="font-medium">{category.name}</p>
                {category.description && (
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {category.followers_count} {t("followers")}
                </p>
              </div>
            </Link>
            {user && (
              <FollowButton
                id={category.id}
                type="category"
                initialFollowed={true}
                onFollowChange={(isFollowed) =>
                  handleFollowChange(category.id, isFollowed)
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
