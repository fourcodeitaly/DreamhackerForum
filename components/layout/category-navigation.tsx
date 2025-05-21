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
      id: "tags",
      name: t("tags"),
      categories: [
        { id: "us", name: t("usTag") },
        { id: "ca", name: t("caTag") },
        { id: "hk", name: t("hkTag") },
        { id: "sg", name: t("sgTag") },
        { id: "jp", name: t("jpTag") },
        { id: "se", name: t("seTag") },
        { id: "au", name: t("auTag") },
        { id: "it", name: t("itTag") },
        { id: "ch", name: t("chTag") },
        { id: "uk", name: t("ukTag") },
        { id: "fr", name: t("frTag") },
        { id: "nl", name: t("nlTag") },
        { id: "dk", name: t("dkTag") },
        { id: "fi", name: t("fiTag") },
        { id: "ie", name: t("ieTag") },
        { id: "cn", name: t("cnTag") },
        { id: "de", name: t("deTag") },
        { id: "es", name: t("esTag") },
        { id: "hu", name: t("huTag") },
      ],
    },
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
    {
      id: "scholarship",
      name: t("scholarship"),
      categories: [
        { id: "us-scholarship", name: t("usScholarship") },
        { id: "ca-scholarship", name: t("caScholarship") },
        { id: "hk-scholarship", name: t("hkScholarship") },
        { id: "sg-scholarship", name: t("sgScholarship") },
        { id: "jp-scholarship", name: t("jpScholarship") },
        { id: "se-scholarship", name: t("seScholarship") },
        { id: "de-scholarship", name: t("deScholarship") },
        { id: "es-scholarship", name: t("esScholarship") },
        { id: "hu-scholarship", name: t("huScholarship") },
        { id: "it-scholarship", name: t("itScholarship") },
        { id: "ch-scholarship", name: t("chScholarship") },
        { id: "uk-scholarship", name: t("ukScholarship") },
        { id: "fr-scholarship", name: t("frScholarship") },
      ],
    },
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
                    let href;
                    if (group.id === "tags") {
                      href = `/posts?tag=${category.id}`;
                    } else if (category.id.includes("resources")) {
                      href = `/resources?category=${category.id}`;
                    } else if (category.id.includes("scholarship")) {
                      href = `/posts?tag=${category.id.split("-")[0]}`;
                    } else {
                      href = `/posts?category=${category.id}`;
                    }
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
