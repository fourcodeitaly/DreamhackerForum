"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"
import { PlusCircle } from "lucide-react"

export function CategorySidebar() {
  const { t } = useTranslation()
  const pathname = usePathname()

  const categories = [
    { id: "visa-interview", name: t("visaInterview") },
    { id: "university-interview", name: t("universityInterview") },
    { id: "scholarship-interview", name: t("scholarshipInterview") },
    { id: "language-test", name: t("languageTest") },
    { id: "application-tips", name: t("applicationTips") },
    { id: "cultural-adjustment", name: t("culturalAdjustment") },
  ]

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <CardTitle>{t("categories")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 p-3">
        <Button asChild variant="default" className="w-full justify-start mb-4">
          <Link href="/create-post">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("createPost")}
          </Link>
        </Button>

        <Link href="/" className="block">
          <div
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === "/" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            {t("allPosts")}
          </div>
        </Link>

        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`} className="block">
            <div
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === `/categories/${category.id}` ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {category.name}
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
