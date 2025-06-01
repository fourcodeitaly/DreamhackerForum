"use client";

import type React from "react";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useTranslation } from "@/hooks/use-translation";

export function OwnerCheck({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const { isLoading, user, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!isLoading && user?.id !== userId && user?.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-red-500">
          <CardHeader>
            <CardTitle>{t("unauthorized")}</CardTitle>
            <CardDescription>{t("unauthorizedDescription")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isLoading && !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-red-500">
          <CardHeader>
            <CardTitle>{t("unauthorized")}</CardTitle>
            <CardDescription>{t("unauthorizedDescription")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
