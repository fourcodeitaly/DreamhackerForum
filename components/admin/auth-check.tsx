"use client";

import type React from "react";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-48" />
      </div>
    );
  }

  // If not admin, show access denied
  if (!isLoading && !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("accessDenied")}</AlertTitle>
          <AlertDescription>
            {t("authOnlyAccess")}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => router.push("/")}
            >
              {t("goToHomepage")}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
