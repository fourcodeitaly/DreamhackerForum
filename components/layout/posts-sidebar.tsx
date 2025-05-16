"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/utils/utils";
import { PlusCircle, TrendingUp, Users, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
export function PostsSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const isMobile = useIsMobile();
  const { isAdmin } = useAuth();

  // Define category groups
  const categoryGroups = [
    {
      id: "tags",
      name: t("tags"),
      categories: [
        { id: "us", name: t("usTag"), count: 10 },
        { id: "ca", name: t("caTag"), count: 10 },
        { id: "hk", name: t("hkTag"), count: 10 },
        { id: "sg", name: t("sgTag"), count: 10 },
        { id: "jp", name: t("jpTag"), count: 10 },
        { id: "se", name: t("seTag"), count: 10 },
        { id: "au", name: t("auTag"), count: 10 },
        { id: "it", name: t("itTag"), count: 10 },
        { id: "ch", name: t("chTag"), count: 10 },
        { id: "uk", name: t("ukTag"), count: 10 },
        { id: "fr", name: t("frTag"), count: 10 },
        { id: "nl", name: t("nlTag"), count: 10 },
        { id: "dk", name: t("dkTag"), count: 10 },
        { id: "fi", name: t("fiTag"), count: 10 },
        { id: "ie", name: t("ieTag"), count: 10 },
        { id: "cn", name: t("cnTag"), count: 10 },
        { id: "de", name: t("deTag"), count: 10 },
        { id: "es", name: t("esTag"), count: 10 },
        { id: "hu", name: t("huTag"), count: 10 },
      ],
    },
    {
      id: "mba",
      name: t("mbaPrograms"),
      categories: [
        {
          id: "mba",
          name: t("allMbaPrograms"),
          count: 156,
        },
        {
          id: "mba-school-information",
          name: t("mbaSchoolInformation"),
          count: 156,
        },
        { id: "mba-rankings", name: t("mbaRankings"), count: 89 },
        { id: "mba-application-faq", name: t("mbaApplicationFAQ"), count: 234 },
        {
          id: "mba-application-strategy",
          name: t("mbaApplicationStrategy"),
          count: 167,
        },
        { id: "mba-resume", name: t("mbaResume"), count: 145 },
        {
          id: "mba-recommendation-letter",
          name: t("mbaRecommendationLetter"),
          count: 123,
        },
        { id: "mba-essay-writing", name: t("mbaEssayWriting"), count: 178 },
        { id: "mba-interviews", name: t("mbaInterviews"), count: 267 },
        {
          id: "mba-application-summary",
          name: t("mbaApplicationSummary"),
          count: 134,
        },
      ],
    },
    {
      id: "master",
      name: t("masterPrograms"),
      categories: [
        {
          id: "master",
          name: t("allMasterPrograms"),
          count: 156,
        },
        {
          id: "master-school-introduction",
          name: t("masterSchoolIntroduction"),
          count: 145,
        },
        {
          id: "master-major-ranking",
          name: t("masterMajorRanking"),
          count: 98,
        },
        {
          id: "master-application-faq",
          name: t("masterApplicationFAQ"),
          count: 167,
        },
        {
          id: "master-recommendation-letter",
          name: t("masterRecommendationLetter"),
          count: 134,
        },
        { id: "master-ps-resume", name: t("masterPsResume"), count: 156 },
        {
          id: "master-business-interview",
          name: t("masterBusinessInterview"),
          count: 189,
        },
        {
          id: "master-application-summary",
          name: t("masterApplicationSummary"),
          count: 123,
        },
      ],
    },
    {
      id: "phd",
      name: t("phdPrograms"),
      categories: [
        {
          id: "phd",
          name: t("allPhdPrograms"),
          count: 156,
        },
        {
          id: "phd-business-school-intro",
          name: t("phdBusinessSchoolIntro"),
          count: 89,
        },
        { id: "phd-ranking", name: t("phdRanking"), count: 67 },
        { id: "phd-application-faq", name: t("phdApplicationFAQ"), count: 145 },
        {
          id: "phd-recommendation-letter",
          name: t("phdRecommendationLetter"),
          count: 98,
        },
        {
          id: "phd-application-summary",
          name: t("phdApplicationSummary"),
          count: 112,
        },
        {
          id: "phd-study-experience",
          name: t("phdStudyExperience"),
          count: 134,
        },
        { id: "phd-interview", name: t("phdInterview"), count: 156 },
      ],
    },
    {
      id: "resources",
      name: t("resources"),
      categories: [
        { id: "visa-resources", name: t("resourcesVisaResources"), count: 123 },
        {
          id: "interview-resources",
          name: t("resourcesInterviewResources"),
          count: 134,
        },
        {
          id: "language-resources",
          name: t("resourcesLanguageResources"),
          count: 145,
        },
        {
          id: "application-resources",
          name: t("resourcesApplicationResources"),
          count: 156,
        },
        {
          id: "cultural-resources",
          name: t("resourcesCulturalResources"),
          count: 167,
        },
        {
          id: "financial-resources",
          name: t("resourcesFinancialResources"),
          count: 178,
        },
        { id: "all-resources", name: t("resourcesAllResources"), count: 189 },
      ],
    },
  ];

  // Mock data for trending topics
  const trendingTopics = [
    { name: "MBA Application Tips", count: 45 },
    { name: "Interview Preparation", count: 38 },
    { name: "Resume Writing", count: 32 },
    { name: "Essay Guidelines", count: 29 },
  ];

  // Mock data for active users
  const activeUsers = [
    { name: "John Doe", posts: 12 },
    { name: "Jane Smith", posts: 8 },
    { name: "Mike Johnson", posts: 6 },
  ];

  return (
    <div className="space-y-6">
      {/* Categories */}
      {!isMobile && (
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              {t("categories")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Accordion type="multiple" className="w-full">
              {categoryGroups.map((group) => (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className="border-b-0"
                >
                  <AccordionTrigger className="py-2 text-sm font-medium">
                    {group.name.split(")")[1]}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-2 space-y-1">
                      {group.categories.map((category) => {
                        const href =
                          group.id === "tags"
                            ? `/posts?tag=${category.id}`
                            : category.id.includes("resources")
                            ? `/resources?category=${category.id}`
                            : `/posts?category=${category.id}`;
                        return (
                          <Link key={category.id} href={href} className="block">
                            <div
                              className={cn(
                                "px-3 py-2 rounded-md text-sm font-medium transition-colors flex justify-between items-center",
                                currentCategory === category.id
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-muted"
                              )}
                            >
                              <span>{category.name.split(")")[1]}</span>
                              <Badge variant="secondary" className="ml-2">
                                {category.count}
                              </Badge>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Trending Topics */}
      <Card className="hidden md:block">
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            {t("trendingTopics")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {trendingTopics.map((topic) => (
              <div
                key={topic.name}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-muted-foreground">{topic.name}</span>
                <Badge variant="secondary">{topic.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="hidden md:block">
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {t("activeUsers")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2">
            {activeUsers.map((user) => (
              <div
                key={user.name}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-muted-foreground">{user.name}</span>
                <Badge variant="secondary">{user.posts} posts</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="hidden md:block">
        <CardHeader className="p-4">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            {t("recentActivity")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-2 text-sm text-muted-foreground">
            <div>New post in MBA Rankings</div>
            <div>3 new comments in Interview Tips</div>
            <div>New user joined the forum</div>
            <div>Updated FAQ section</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
