"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  Trophy,
  DollarSign,
  Calendar,
  MapPin,
  ExternalLink,
  Star,
  Users2,
  Activity,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { School } from "@/lib/db/schools/school-get";
import { useState } from "react";
import { useEffect } from "react";
import { useTranslation } from "@/hooks/use-translation";

export default function SchoolsList({
  location,
  initialSchools,
}: {
  location: string;
  initialSchools: School[];
}) {
  const [schools, setSchools] = useState<School[]>(initialSchools);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setSchools(initialSchools);
    setOffset(0);
    setHasMore(initialSchools.length === 10);
  }, [initialSchools]);

  const loadMore = async () => {
    setIsLoadingMore(true);
    const orderBy = "qs_world_rank";
    const newOffset = offset + 10;
    const response = await fetch(
      `/api/schools?limit=10&offset=${newOffset}&orderBy=${orderBy}&nationCode=${location}`
    );

    const moreSchools = (await response.json()) as School[];

    setSchools([
      ...schools,
      ...moreSchools.filter(
        (school) => !schools.some((s) => s.id === school.id)
      ),
    ]);
    setOffset(newOffset);
    setHasMore(moreSchools.length === 10);
    setIsLoadingMore(false);
  };

  if (schools.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            No schools found matching your criteria
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="lg:col-span-3 space-y-6">
      {schools.map((school) => (
        <Card key={school.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              {/* School Header */}
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={school.logo || "/placeholder.png"}
                    alt={school.name}
                    fill
                    className="object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "https://marketplace.canva.com/EAGLvNcMY10/1/0/1600w/canva-white-and-blue-illustrative-class-logo-mjY8ushmYT4.jpg";
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold mb-2 text-wrap">
                        {school.name}
                      </h3>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span className="text-wrap text-sm md:text-md">
                            {school.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="hidden md:block">•</span>
                          <Building2 className="h-4 w-4" />
                          <span className="capitalize text-nowrap text-sm md:text-md">
                            {school.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        <Trophy className="h-4 w-4 mr-1" />
                        Rank #{school.qs_world_rank}
                      </Badge>
                      <Button variant="outline" size="icon">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* School Details Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
                  <TabsTrigger value="admissions">
                    {t("admissions")}
                  </TabsTrigger>
                  {/* <TabsTrigger value="academics">Academics</TabsTrigger> */}
                  <TabsTrigger value="campus">{t("campusLife")}</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      {school.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center text-center">
                            <Users className="h-6 w-6 mb-2 text-primary" />
                            <div className="text-2xl font-bold">
                              {school.total_students?.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t("numberStudents")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center text-center">
                            <DollarSign className="h-6 w-6 mb-2 text-primary" />
                            <div className="text-2xl font-bold">
                              ${school.tuition.international?.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t("tuitionInternational")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center text-center">
                            <Activity className="h-6 w-6 mb-2 text-primary" />
                            <div className="text-2xl font-bold">
                              {school.acceptance_rate}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t("acceptanceRate")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col items-center text-center">
                            <Users2 className="h-6 w-6 mb-2 text-primary" />
                            <div className="text-2xl font-bold">
                              {school.campus_life?.student_clubs}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t("studentClubs")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="admissions" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <div className="text-sm text-muted-foreground mb-1">
                              {t("averageGpa")}
                            </div>
                            <div className="text-2xl font-bold">
                              {school.average_gpa}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <div className="text-sm text-muted-foreground mb-1">
                              {t("averageGre")}
                            </div>
                            <div className="text-2xl font-bold">
                              {school.average_gre}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <div className="text-sm text-muted-foreground mb-1">
                              {t("averageToefl")}
                            </div>
                            <div className="text-2xl font-bold">
                              {school.average_toefl}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* <Card>
                                  <CardContent className="p-4">
                                    <div className="flex flex-col">
                                      <div className="text-sm text-muted-foreground mb-1">
                                        In-State Tuition
                                      </div>
                                      <div className="text-2xl font-bold">
                                        $
                                        {school.tuition.in_state?.toLocaleString()}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card> */}
                      {/* <Card>
                                  <CardContent className="p-4">
                                    <div className="flex flex-col">
                                      <div className="text-sm text-muted-foreground mb-1">
                                        Out-of-State Tuition
                                      </div>
                                      <div className="text-2xl font-bold">
                                        $
                                        {school.tuition.out_state?.toLocaleString()}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card> */}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="academics" className="mt-4">
                  <div className="space-y-4">
                    <h4 className="font-medium">{t("popularMajors")}</h4>
                    <div className="flex flex-wrap gap-2">
                      {school.popular_majors?.map((major: string) => (
                        <Badge
                          key={major}
                          variant="secondary"
                          className="text-sm"
                        >
                          {major}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="campus" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <div className="text-sm text-muted-foreground mb-1">
                              {t("studentClubs")}
                            </div>
                            <div className="text-2xl font-bold">
                              {school.campus_life?.student_clubs}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <div className="text-sm text-muted-foreground mb-1">
                              {t("sportsTeams")}
                            </div>
                            <div className="text-2xl font-bold">
                              {school.campus_life?.sports_teams}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">
                        {t("housingOptions")}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {school.campus_life?.housing_options.map(
                          (option: string) => (
                            <Badge
                              key={option}
                              variant="secondary"
                              className="text-sm"
                            >
                              {option}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Button asChild>
                  <Link href={`/schools/${school.id}`}>
                    <Building2 className="h-4 w-4 mr-2" />
                    {t("details")}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/schools/${school.id}`}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t("visitWebsite")}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="w-full max-w-xs"
          >
            {isLoadingMore ? t("loading") : t("loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
}
