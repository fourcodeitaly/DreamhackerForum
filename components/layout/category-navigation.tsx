"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/utils/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function CategoryNavigation() {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  // Define category groups
  const categoryGroups = [
    {
      id: "mba",
      name: t("mbaPrograms"),
      categories: [
        { id: "mba-school-information", name: t("mbaSchoolInformation") },
        { id: "mba-rankings", name: t("mbaRankings") },
        { id: "mba-application-faq", name: t("mbaApplicationFAQ") },
        { id: "mba-application-strategy", name: t("mbaApplicationStrategy") },
        { id: "mba-resume", name: t("mbaResume") },
        { id: "mba-recommendation-letter", name: t("mbaRecommendationLetter") },
        { id: "mba-essay-writing", name: t("mbaEssayWriting") },
        { id: "mba-interviews", name: t("mbaInterviews") },
        { id: "mba-application-summary", name: t("mbaApplicationSummary") },
      ],
    },
    {
      id: "master",
      name: t("masterPrograms"),
      categories: [
        {
          id: "master-school-introduction",
          name: t("masterSchoolIntroduction"),
        },
        { id: "master-major-ranking", name: t("masterMajorRanking") },
        { id: "master-application-faq", name: t("masterApplicationFAQ") },
        {
          id: "master-recommendation-letter",
          name: t("masterRecommendationLetter"),
        },
        { id: "master-ps-resume", name: t("masterPsResume") },
        { id: "master-business-interview", name: t("masterBusinessInterview") },
        {
          id: "master-application-summary",
          name: t("masterApplicationSummary"),
        },
      ],
    },
    {
      id: "phd",
      name: t("phdPrograms"),
      categories: [
        { id: "phd-business-school-intro", name: t("phdBusinessSchoolIntro") },
        { id: "phd-ranking", name: t("phdRanking") },
        { id: "phd-application-faq", name: t("phdApplicationFAQ") },
        { id: "phd-recommendation-letter", name: t("phdRecommendationLetter") },
        { id: "phd-application-summary", name: t("phdApplicationSummary") },
        { id: "phd-study-experience", name: t("phdStudyExperience") },
        { id: "phd-interview", name: t("phdInterview") },
      ],
    },
    {
      id: "resources",
      name: t("resources"),
      categories: [
        { id: "visa-resources", name: t("visaResources") },
        { id: "interview-resources", name: t("interviewResources") },
        { id: "language-resources", name: t("languageResources") },
        { id: "application-resources", name: t("applicationResources") },
        { id: "cultural-resources", name: t("culturalResources") },
        { id: "financial-resources", name: t("financialResources") },
      ],
    },
    // {
    //   id: "study-abroad",
    //   name: t("studyAbroad"),
    //   categories: [
    //     { id: "visa-interview", name: t("visaInterview") },
    //     { id: "university-interview", name: t("universityInterview") },
    //     { id: "scholarship-interview", name: t("scholarshipInterview") },
    //     { id: "language-test", name: t("languageTest") },
    //     { id: "application-tips", name: t("applicationTips") },
    //     { id: "cultural-adjustment", name: t("culturalAdjustment") },
    //   ],
    // },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {categoryGroups.map((group) => (
          <NavigationMenuItem key={group.id}>
            <NavigationMenuTrigger>{group.name}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {group.categories.map((category) => {
                  const href = category.id.includes("resources")
                    ? `/resources?category=${category.id}`
                    : `/posts?category=${category.id}`;
                  return (
                    <li key={category.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={href}
                          className={cn(
                            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                            currentCategory === category.id
                              ? "bg-accent text-accent-foreground"
                              : ""
                          )}
                        >
                          <div className="text-sm font-medium leading-none">
                            {category.name}
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
