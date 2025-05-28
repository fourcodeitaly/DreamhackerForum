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
import { Button } from "@/components/ui/button";

export function CategoryNavigation({ className }: { className?: string }) {
  const { t } = useTranslation();

  // Define category groups
  const categoryGroups = [
    {
      id: "tags",
      name: t("tags"),
      categories: [
        { id: "75d74626-55fe-47be-bc03-7e6531d19249", name: t("usTag") },
        { id: "e4e9fb41-5a05-470c-925b-f91b1a00d962", name: t("caTag") },
        { id: "379ec624-0d31-4026-aa48-38396f542fe5", name: t("hkTag") },
        { id: "83f2e16c-5c5d-459f-ab3d-301efefa78ad", name: t("sgTag") },
        { id: "d87db404-09f1-4f92-ada4-16e8baa73856", name: t("jpTag") },
        { id: "8c589bbf-0cce-4d26-a28c-d17c8942155e", name: t("seTag") },
        { id: "40e5e7f7-fc8c-4e17-9297-02e4c04623f4", name: t("auTag") },
        { id: "4edebb77-56a0-451e-92cb-5c3cda094349", name: t("itTag") },
        { id: "43428091-acb5-478d-b351-975725896454", name: t("chTag") },
        { id: "65df2188-2c7a-43e0-affc-bf0d4ac924f5", name: t("ukTag") },
        { id: "3a3b7c21-9f07-40bb-944b-b72fe89ef8c9", name: t("frTag") },
        { id: "7b98881d-f4de-40f6-81e0-4ec9e7f4dff4", name: t("nlTag") },
        { id: "1160cfeb-35fd-4ad0-b03e-5b35a6d32d22", name: t("dkTag") },
        { id: "442e3a3f-75db-4a0e-8ec2-6a161c00e2b9", name: t("fiTag") },
        { id: "f38ab0c6-88ee-4587-bfe7-2eee9585b1ca", name: t("ieTag") },
        { id: "4b1a14a4-a5a9-46af-968f-2d1d75f470e5", name: t("cnTag") },
        { id: "705da86e-4ea8-4d96-a33d-16b8d4d4bf8f", name: t("deTag") },
        { id: "4c9579a3-8ac8-43bb-8fbb-32280ba0bb91", name: t("esTag") },
        { id: "ef5fe957-7903-4629-8f2b-a7035d4dc8b7", name: t("huTag") },
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
        { id: "master-scholarship", name: t("masterScholarship") },
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
        { id: "phd-scholarship", name: t("phdScholarship") },
        { id: "phd-business-school-intro", name: t("phdBusinessSchoolIntro") },
        { id: "phd-ranking", name: t("phdRanking") },
        { id: "phd-application-faq", name: t("phdApplicationFAQ") },
        { id: "phd-recommendation-letter", name: t("phdRecommendationLetter") },
        { id: "phd-application-summary", name: t("phdApplicationSummary") },
        { id: "phd-study-experience", name: t("phdStudyExperience") },
        { id: "phd-interview", name: t("phdInterview") },
      ],
    },
    // {
    //   id: "resources",
    //   name: t("resources"),
    //   categories: [
    //     { id: "all-resources", name: t("resourcesAllResources") },
    //     { id: "visa-resources", name: t("resourcesVisaResources") },
    //     { id: "interview-resources", name: t("resourcesInterviewResources") },
    //     { id: "language-resources", name: t("resourcesLanguageResources") },
    //     {
    //       id: "application-resources",
    //       name: t("resourcesApplicationResources"),
    //     },
    //     { id: "cultural-resources", name: t("resourcesCulturalResources") },
    //     { id: "financial-resources", name: t("resourcesFinancialResources") },
    //   ],
    // },
    {
      id: "schools",
      name: t("schools"),
      categories: [
        { id: "us", name: t("allSchools") },
        { id: "us", name: t("usTag") },
        { id: "uk", name: t("ukTag") },
        { id: "de", name: t("deTag") },
        { id: "fr", name: t("frTag") },
        { id: "ca", name: t("caTag") },
        { id: "au", name: t("auTag") },
        { id: "sg", name: t("sgTag") },
        { id: "hk", name: t("hkTag") },
        { id: "cn", name: t("cnTag") },
        { id: "jp", name: t("jpTag") },
        { id: "kr", name: t("krTag") },
        { id: "tw", name: t("twTag") },
      ],
    },
    {
      id: "events",
      name: t("events"),
      categories: [{ id: "all-events", name: t("allEvents") }],
    },
    {
      id: "scholarship",
      name: t("scholarship"),
      categories: [
        {
          id: "c34d416e-1bed-4474-a020-e83032e2b15d",
          name: t("allScholarships"),
        },
      ],
    },

    {
      id: "internship",
      name: t("internship"),
      categories: [
        { id: "internship", name: t("allInternship") },
        // { id: "internship", name: t("usInternship") },
        // { id: "internship", name: t("ukInternship") },
        // { id: "internship", name: t("caInternship") },
        // { id: "internship", name: t("hkInternship") },
        // { id: "internship", name: t("sgInternship") },
        // { id: "internship", name: t("jpInternship") },
        // { id: "internship", name: t("seInternship") },
        // { id: "internship", name: t("deInternship") },
        // { id: "internship", name: t("esInternship") },
        // { id: "internship", name: t("huInternship") },
        // { id: "internship", name: t("itInternship") },
      ],
    },
  ];

  return (
    <Suspense>
      <NavigationMenu>
        <NavigationMenuList className={cn(className)}>
          {categoryGroups.map((group) => {
            // If there's only one category, render a button instead
            if (group.categories.length === 1) {
              const category = group.categories[0];
              let href;
              if (group.id === "tags") {
                href = `/posts?tag=${category.id}`;
              } else if (category.id.includes("resources")) {
                href = `/resources?category=${category.id}`;
              } else if (group.id === "scholarship") {
                href = `/posts?tag=${category.id}`;
              } else if (group.id === "schools") {
                href = `/schools?location=${category.id}`;
              } else if (group.id === "events") {
                href = `/events`;
              } else {
                href = `/posts?category=${category.id}`;
              }

              return (
                <li key={group.id}>
                  <Button variant="ghost" className="h-10 px-4 py-2" asChild>
                    <Link href={href}>{group.name.split(")")[1]}</Link>
                  </Button>
                </li>
              );
            }

            // Otherwise render the navigation menu item
            return (
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
                      } else if (group.id === "scholarship") {
                        href = `/posts?tag=${category.id}`;
                      } else if (group.id === "schools") {
                        href = `/schools?location=${category.id}`;
                      } else if (group.id === "events") {
                        href = `/events`;
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
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </Suspense>
  );
}
