"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/utils/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Suspense } from "react";

export function CategoryNavigation() {
  const { t } = useTranslation();

  // Define category groups
  const categoryGroups = [
    {
      id: "mba",
      name: t("mbaPrograms"),
      categories: [
        { id: "mba", name: t("allMbaPrograms") },
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
        { id: "master", name: t("allMasterPrograms") },
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
        { id: "phd", name: t("allPhdPrograms") },
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
        { id: "all-resources", name: t("resourcesAllResources") },
        { id: "visa-resources", name: t("resourcesVisaResources") },
        { id: "interview-resources", name: t("resourcesInterviewResources") },
        { id: "language-resources", name: t("resourcesLanguageResources") },
        {
          id: "application-resources",
          name: t("resourcesApplicationResources"),
        },
        { id: "cultural-resources", name: t("resourcesCulturalResources") },
        { id: "financial-resources", name: t("resourcesFinancialResources") },
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
    <Suspense>
      <NavigationMenu>
        <NavigationMenuList>
          {categoryGroups.map((group) => (
            <NavigationMenuItem key={group.id}>
              <NavigationMenuTrigger className="bg-transparent">
                {group.name.split(")")[1]}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-full gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
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
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">
                              {category.name.split(")")[1]}
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
    </Suspense>
  );
}
