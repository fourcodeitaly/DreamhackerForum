"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/utils/utils";

export function ResourceCategories() {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: t("allResources") },
    { id: "visa", name: t("visaResources") },
    { id: "interview", name: t("interviewResources") },
    { id: "language", name: t("languageResources") },
    { id: "application", name: t("applicationResources") },
    { id: "cultural", name: t("culturalResources") },
    { id: "financial", name: t("financialResources") },
  ];

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <CardTitle>{t("resourceCategories")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 p-3">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant="ghost"
            className={cn(
              "w-full justify-start",
              activeCategory === category.id && "bg-muted"
            )}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
