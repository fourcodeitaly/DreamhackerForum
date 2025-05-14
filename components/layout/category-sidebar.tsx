// "use client";

// import Link from "next/link";
// import { usePathname, useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useTranslation } from "@/hooks/use-translation";
// import { useAuth } from "@/hooks/use-auth";
// import { cn } from "@/utils/utils";
// import { PlusCircle } from "lucide-react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";

// export function CategorySidebar({
//   activeCategoryId,
// }: {
//   activeCategoryId?: string;
// }) {
//   const { t } = useTranslation();
//   const { isAdmin } = useAuth();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const currentCategory = searchParams.get("category");

//   // Define category groups
//   const categoryGroups = [
//     {
//       id: "mba",
//       name: t("mbaPrograms"),
//       categories: [
//         { id: "mba-school-information", name: t("mbaSchoolInformation") },
//         { id: "mba-rankings", name: t("mbaRankings") },
//         { id: "mba-application-faq", name: t("mbaApplicationFAQ") },
//         { id: "mba-application-strategy", name: t("mbaApplicationStrategy") },
//         { id: "mba-resume", name: t("mbaResume") },
//         { id: "mba-recommendation-letter", name: t("mbaRecommendationLetter") },
//         { id: "mba-essay-writing", name: t("mbaEssayWriting") },
//         { id: "mba-interviews", name: t("mbaInterviews") },
//         { id: "mba-application-summary", name: t("mbaApplicationSummary") },
//       ],
//     },
//     {
//       id: "master",
//       name: t("masterPrograms"),
//       categories: [
//         {
//           id: "master-school-introduction",
//           name: t("masterSchoolIntroduction"),
//         },
//         { id: "master-major-ranking", name: t("masterMajorRanking") },
//         { id: "master-application-faq", name: t("masterApplicationFAQ") },
//         {
//           id: "master-recommendation-letter",
//           name: t("masterRecommendationLetter"),
//         },
//         { id: "master-ps-resume", name: t("masterPsResume") },
//         { id: "master-business-interview", name: t("masterBusinessInterview") },
//         {
//           id: "master-application-summary",
//           name: t("masterApplicationSummary"),
//         },
//       ],
//     },
//     {
//       id: "phd",
//       name: t("phdPrograms"),
//       categories: [
//         { id: "phd-business-school-intro", name: t("phdBusinessSchoolIntro") },
//         { id: "phd-ranking", name: t("phdRanking") },
//         { id: "phd-application-faq", name: t("phdApplicationFAQ") },
//         { id: "phd-recommendation-letter", name: t("phdRecommendationLetter") },
//         { id: "phd-application-summary", name: t("phdApplicationSummary") },
//         { id: "phd-study-experience", name: t("phdStudyExperience") },
//         { id: "phd-interview", name: t("phdInterview") },
//       ],
//     },
//     {
//       id: "study-abroad",
//       name: t("studyAbroad"),
//       categories: [
//         { id: "visa-interview", name: t("visaInterview") },
//         { id: "university-interview", name: t("universityInterview") },
//         { id: "scholarship-interview", name: t("scholarshipInterview") },
//         { id: "language-test", name: t("languageTest") },
//         { id: "application-tips", name: t("applicationTips") },
//         { id: "cultural-adjustment", name: t("culturalAdjustment") },
//       ],
//     },
//   ];

//   return (
//     <Card className="sticky top-20">
//       <CardHeader className="p-3 pt-6">
//         <CardTitle>{t("categories")}</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-1 p-3">
//         {/* Only show Create Post button for admin users */}
//         {isAdmin && (
//           <Button
//             asChild
//             variant="default"
//             className="w-full justify-start mb-4"
//           >
//             <Link href="/create-post">
//               <PlusCircle className="mr-2 h-4 w-4" />
//               {t("createPost")}
//             </Link>
//           </Button>
//         )}

//         <Link href="/posts" className="block">
//           <div
//             className={cn(
//               "rounded-md text-md font-bold transition-colors",
//               !currentCategory
//                 ? "bg-primary text-primary-foreground"
//                 : "hover:bg-muted"
//             )}
//           >
//             {t("allPosts")}
//           </div>
//         </Link>

//         <Accordion type="multiple" className="w-full">
//           {categoryGroups.map((group) => (
//             <AccordionItem
//               key={group.id}
//               value={group.id}
//               className="border-b-0"
//             >
//               <AccordionTrigger className="py-2 text-sm font-medium">
//                 {group.name}
//               </AccordionTrigger>
//               <AccordionContent>
//                 <div className="pl-2 space-y-1">
//                   {group.categories.map((category) => (
//                     <Link
//                       key={category.id}
//                       href={`/posts?category=${category.id}`}
//                       className="block"
//                     >
//                       <div
//                         className={cn(
//                           "px-3 py-2 rounded-md text-sm font-medium transition-colors",
//                           currentCategory === category.id
//                             ? "bg-primary text-primary-foreground"
//                             : "hover:bg-muted"
//                         )}
//                       >
//                         {category.name}
//                       </div>
//                     </Link>
//                   ))}
//                 </div>
//               </AccordionContent>
//             </AccordionItem>
//           ))}
//         </Accordion>
//       </CardContent>
//     </Card>
//   );
// }
