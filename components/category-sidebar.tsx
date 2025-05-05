"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/hooks/use-translation"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import { PlusCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function CategorySidebar({
  activeCategoryId,
}: {
  activeCategoryId?: string
}) {
  const { t } = useTranslation()
  const { isAdmin } = useAuth()
  const pathname = usePathname()

  // Define category groups
  const categoryGroups = [
    {
      id: "mba",
      name: t("mbaPrograms"),
      categories: [
        { id: "mba-school-information", name: t("schoolInformation") },
        { id: "mba-rankings", name: t("mbaRankings") },
        { id: "mba-application-faq", name: t("applicationFAQ") },
        { id: "mba-application-strategy", name: t("applicationStrategy") },
        { id: "mba-resume", name: t("resume") },
        { id: "mba-recommendation-letter", name: t("recommendationLetter") },
        { id: "mba-essay-writing", name: t("essayWriting") },
        { id: "mba-interviews", name: t("mbaInterviews") },
        { id: "mba-application-summary", name: t("applicationSummary") },
      ],
    },
    {
      id: "master",
      name: t("businessSchool"),
      categories: [
        { id: "school-introduction", name: t("schoolIntroduction") },
        { id: "major-and-ranking", name: t("majorAndRanking") },
        { id: "master-application-faq", name: t("applicationFAQ") },
        { id: "master-recommendation-letter", name: t("recommendationLetter") },
        { id: "ps-resume", name: t("psResume") },
        { id: "business-interview", name: t("businessInterview") },
        { id: "master-application-summary", name: t("applicationSummary") },
      ],
    },
    {
      id: "phd",
      name: t("phdPrograms"),
      categories: [
        { id: "business-school-intro", name: t("businessSchoolIntro") },
        { id: "phd-ranking", name: t("ranking") },
        { id: "phd-application-faq", name: t("applicationFAQ") },
        { id: "phd-recommendation-letter", name: t("recommendationLetter") },
        { id: "phd-application-summary", name: t("applicationSummary") },
        { id: "phd-study-experience", name: t("phdStudyExperience") },
        { id: "phd-interview", name: t("phdInterview") },
      ],
    },
    {
      id: "study-abroad",
      name: t("studyAbroad"),
      categories: [
        { id: "visa-interview", name: t("visaInterview") },
        { id: "university-interview", name: t("universityInterview") },
        { id: "scholarship-interview", name: t("scholarshipInterview") },
        { id: "language-test", name: t("languageTest") },
        { id: "application-tips", name: t("applicationTips") },
        { id: "cultural-adjustment", name: t("culturalAdjustment") },
      ],
    },
  ]

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <CardTitle>{t("categories")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 p-3">
        {/* Only show Create Post button for admin users */}
        {isAdmin && (
          <Button asChild variant="default" className="w-full justify-start mb-4">
            <Link href="/create-post">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("createPost")}
            </Link>
          </Button>
        )}

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

        <Accordion type="multiple" className="w-full">
          {categoryGroups.map((group) => (
            <AccordionItem key={group.id} value={group.id} className="border-b-0">
              <AccordionTrigger className="py-2 text-sm font-medium">{group.name}</AccordionTrigger>
              <AccordionContent>
                <div className="pl-2 space-y-1">
                  {group.categories.map((category) => (
                    <Link key={category.id} href={`/categories/${category.id}`} className="block">
                      <div
                        className={cn(
                          "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          pathname === `/categories/${category.id}`
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted",
                        )}
                      >
                        {category.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
