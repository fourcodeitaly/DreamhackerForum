// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Building2,
//   Users,
//   Trophy,
//   DollarSign,
//   Calendar,
//   MapPin,
//   ExternalLink,
//   Star,
//   Users2,
//   Activity,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { mockSchools } from "@/lib/mock/schools";

// export const dynamic = "force-dynamic";

// export default async function SchoolsPage() {
//   const schools = mockSchools;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
//       {/* Hero Section */}
//       <div className="relative bg-primary/5 py-10">
//         <div className="container mx-auto px-4">
//           <div className="max-w-4xl mx-auto text-center">
//             <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
//               Explore Top Universities
//             </h1>
//             <p className="text-lg text-muted-foreground mb-8">
//               Discover detailed information about leading universities worldwide
//             </p>
//             <div className="flex justify-center gap-4">
//               <Button asChild>
//                 <Link href="/schools/compare">Compare Universities</Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Filters Sidebar */}
//           <div className="lg:col-span-1">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Filters</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   <div>
//                     <h4 className="font-medium mb-2">University Type</h4>
//                     <div className="space-y-2">
//                       <Button
//                         variant="outline"
//                         className="w-full justify-start"
//                       >
//                         Public
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="w-full justify-start"
//                       >
//                         Private
//                       </Button>
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="font-medium mb-2">Location</h4>
//                     <div className="space-y-2">
//                       <Button
//                         variant="outline"
//                         className="w-full justify-start"
//                       >
//                         United States
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="w-full justify-start"
//                       >
//                         United Kingdom
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="w-full justify-start"
//                       >
//                         Canada
//                       </Button>
//                     </div>
//                   </div>

//                   <div>
//                     <h4 className="font-medium mb-2">Ranking Range</h4>
//                     <div className="space-y-2">
//                       <Button
//                         variant="outline"
//                         className="w-full justify-start"
//                       >
//                         Top 10
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="w-full justify-start"
//                       >
//                         Top 25
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="w-full justify-start"
//                       >
//                         Top 50
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Schools List */}
//           <div className="lg:col-span-3 space-y-6">
//             {schools.map((school) => (
//               <Card key={school.id} className="overflow-hidden">
//                 <CardContent className="p-6">
//                   <div className="flex flex-col gap-6">
//                     {/* School Header */}
//                     <div className="flex items-start gap-6">
//                       <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
//                         <Image
//                           src={school.logo}
//                           alt={school.name}
//                           fill
//                           className="object-contain"
//                         />
//                       </div>
//                       <div className="flex-grow">
//                         <div className="flex items-start justify-between gap-4">
//                           <div>
//                             <h3 className="text-2xl font-bold mb-2">
//                               {school.name}
//                             </h3>
//                             <div className="flex items-center gap-2 text-muted-foreground">
//                               <MapPin className="h-4 w-4" />
//                               <span>{school.location}</span>
//                               <span>•</span>
//                               <Building2 className="h-4 w-4" />
//                               <span className="capitalize">{school.type}</span>
//                               <span>•</span>
//                               <Calendar className="h-4 w-4" />
//                               <span>Founded {school.founded}</span>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-2">
//                             <Badge
//                               variant="secondary"
//                               className="bg-yellow-100 text-yellow-800"
//                             >
//                               <Trophy className="h-4 w-4 mr-1" />
//                               Rank #{school.ranking}
//                             </Badge>
//                             <Button variant="outline" size="icon">
//                               <Star className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* School Details Tabs */}
//                     <Tabs defaultValue="overview" className="w-full">
//                       <TabsList className="grid w-full grid-cols-4">
//                         <TabsTrigger value="overview">Overview</TabsTrigger>
//                         <TabsTrigger value="admissions">Admissions</TabsTrigger>
//                         <TabsTrigger value="academics">Academics</TabsTrigger>
//                         <TabsTrigger value="campus">Campus Life</TabsTrigger>
//                       </TabsList>

//                       <TabsContent value="overview" className="mt-4">
//                         <div className="space-y-4">
//                           <p className="text-muted-foreground">
//                             {school.description}
//                           </p>
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                             <Card>
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col items-center text-center">
//                                   <Users className="h-6 w-6 mb-2 text-primary" />
//                                   <div className="text-2xl font-bold">
//                                     {school.totalStudents.toLocaleString()}
//                                   </div>
//                                   <div className="text-sm text-muted-foreground">
//                                     Students
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                             <Card>
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col items-center text-center">
//                                   <DollarSign className="h-6 w-6 mb-2 text-primary" />
//                                   <div className="text-2xl font-bold">
//                                     ${school.tuition.inState.toLocaleString()}
//                                   </div>
//                                   <div className="text-sm text-muted-foreground">
//                                     Tuition (In-State)
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                             <Card>
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col items-center text-center">
//                                   <Activity className="h-6 w-6 mb-2 text-primary" />
//                                   <div className="text-2xl font-bold">
//                                     {school.acceptanceRate}%
//                                   </div>
//                                   <div className="text-sm text-muted-foreground">
//                                     Acceptance Rate
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                             <Card>
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col items-center text-center">
//                                   <Users2 className="h-6 w-6 mb-2 text-primary" />
//                                   <div className="text-2xl font-bold">
//                                     {school.campusLife.studentClubs}
//                                   </div>
//                                   <div className="text-sm text-muted-foreground">
//                                     Student Clubs
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           </div>
//                         </div>
//                       </TabsContent>

//                       <TabsContent value="admissions" className="mt-4">
//                         <div className="space-y-4">
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <Card>
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col">
//                                   <div className="text-sm text-muted-foreground mb-1">
//                                     Average GPA
//                                   </div>
//                                   <div className="text-2xl font-bold">
//                                     {school.averageGPA}
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                             <Card>
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col">
//                                   <div className="text-sm text-muted-foreground mb-1">
//                                     Average SAT
//                                   </div>
//                                   <div className="text-2xl font-bold">
//                                     {school.averageSAT}
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                             <Card>
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col">
//                                   <div className="text-sm text-muted-foreground mb-1">
//                                     Average ACT
//                                   </div>
//                                   <div className="text-2xl font-bold">
//                                     {school.averageACT}
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           </div>
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <Card>
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col">
//                                   <div className="text-sm text-muted-foreground mb-1">
//                                     In-State Tuition
//                                   </div>
//                                   <div className="text-2xl font-bold">
//                                     ${school.tuition.inState.toLocaleString()}
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                             <Card>
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col">
//                                   <div className="text-sm text-muted-foreground mb-1">
//                                     Out-of-State Tuition
//                                   </div>
//                                   <div className="text-2xl font-bold">
//                                     ${school.tuition.outState.toLocaleString()}
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           </div>
//                         </div>
//                       </TabsContent>

//                       <TabsContent value="academics" className="mt-4">
//                         <div className="space-y-4">
//                           <h4 className="font-medium">Popular Majors</h4>
//                           <div className="flex flex-wrap gap-2">
//                             {school.popularMajors.map((major: string) => (
//                               <Badge
//                                 key={major}
//                                 variant="secondary"
//                                 className="text-sm"
//                               >
//                                 {major}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                       </TabsContent>

//                       <TabsContent value="campus" className="mt-4">
//                         <div className="space-y-4">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <Card>
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col">
//                                   <div className="text-sm text-muted-foreground mb-1">
//                                     Student Clubs
//                                   </div>
//                                   <div className="text-2xl font-bold">
//                                     {school.campusLife.studentClubs}
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                             <Card>
//                               <CardContent className="p-4">
//                                 <div className="flex flex-col">
//                                   <div className="text-sm text-muted-foreground mb-1">
//                                     Sports Teams
//                                   </div>
//                                   <div className="text-2xl font-bold">
//                                     {school.campusLife.sportsTeams}
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           </div>
//                           <div>
//                             <h4 className="font-medium mb-2">
//                               Housing Options
//                             </h4>
//                             <div className="flex flex-wrap gap-2">
//                               {school.campusLife.housingOptions.map(
//                                 (option: string) => (
//                                   <Badge
//                                     key={option}
//                                     variant="secondary"
//                                     className="text-sm"
//                                   >
//                                     {option}
//                                   </Badge>
//                                 )
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </TabsContent>
//                     </Tabs>

//                     {/* Action Buttons */}
//                     <div className="flex items-center gap-4">
//                       <Button>Apply Now</Button>
//                       <Button variant="outline">
//                         <ExternalLink className="h-4 w-4 mr-2" />
//                         Visit Website
//                       </Button>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
