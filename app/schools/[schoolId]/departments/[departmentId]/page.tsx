import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Trophy,
  GraduationCap,
  BookOpen,
  Globe,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getSchoolById, School } from "@/lib/db/schools/school-get";
import { getDepartmentBySchoolId } from "@/lib/db/departments/department-get";
import { getServerTranslation } from "@/lib/get-translation";
import { FallbackImage } from "@/components/layout/fallback-image";

interface DepartmentPageProps {
  params: Promise<{
    departmentId: string;
    schoolId: string;
  }>;
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const { t } = await getServerTranslation();

  const { departmentId, schoolId } = await params;

  const [departments, school] = await Promise.all([
    getDepartmentBySchoolId(schoolId),
    getSchoolById(schoolId),
  ]);

  const department = departments.find((d) => d.id === departmentId);

  if (!department || !school) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">Department not found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const acceptanceRate =
    (department.number_of_admissions / department.number_of_applications) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-[300px] relative">
          <FallbackImage
            src={school.logo}
            alt={department.name}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0 bg-white">
                    <FallbackImage
                      src={school.logo}
                      alt={school.name}
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="text-white">
                    <h1 className="text-3xl font-bold mb-2">
                      {department.name}
                    </h1>
                    <div className="flex items-center gap-4">
                      <Link href={`/schools/${school.id}`}>
                        <Badge
                          variant="secondary"
                          className="bg-white/20 hover:bg-white/30"
                        >
                          {school.name}
                        </Badge>
                      </Link>
                      {/* {department.qs_world_rank && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          <Trophy className="h-4 w-4 mr-1" />
                          QS World Rank #{department.qs_world_rank}
                        </Badge>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                    <Users className="h-6 w-6 mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {department.number_of_applications.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("applications")}
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                    <Users className="h-6 w-6 mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {department.number_of_admissions.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("admissions")}
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                    <Trophy className="h-6 w-6 mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {acceptanceRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("acceptanceRate")}
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                    <Building2 className="h-6 w-6 mb-2 text-primary" />
                    <div className="text-2xl font-bold">{school.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {t("institution")}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("aboutTheDepartment")}
                    </h3>
                    <p className="text-muted-foreground">
                      The {department.name} at {school.name} is renowned for its
                      excellence in education and research. With a strong focus
                      on academic rigor and innovation, the department provides
                      students with exceptional opportunities for growth and
                      development in their chosen field.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {t("keyFeatures")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">
                            {t("academicExcellence")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            World-class faculty and cutting-edge research
                            facilities
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">
                            {t("diverseCommunity")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            International student body and collaborative
                            environment
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">
                            {t("researchOpportunities")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Extensive research programs and funding
                            opportunities
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">{t("globalNetwork")}</h4>
                          <p className="text-sm text-muted-foreground">
                            Strong industry connections and alumni network
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rankings */}
            <Card>
              <CardHeader>
                <CardTitle>{t("rankingsAndRecognition")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* {department.qs_world_rank && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        QS World Rank
                      </div>
                      <div className="text-2xl font-bold">
                        #{department.qs_world_rank}
                      </div>
                    </div>
                  )}
                  {department.us_news_rank_world && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        US News World Rank
                      </div>
                      <div className="text-2xl font-bold">
                        #{department.us_news_rank_world}
                      </div>
                    </div>
                  )}
                  {department.us_rank && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        US Rank
                      </div>
                      <div className="text-2xl font-bold">
                        #{department.us_rank}
                      </div>
                    </div>
                  )} */}
                  {department.law_school_rank_us && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Law School Rank
                      </div>
                      <div className="text-2xl font-bold">
                        #{department.law_school_rank_us}
                      </div>
                    </div>
                  )}
                  {department.business_school_rank_us && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Business School Rank
                      </div>
                      <div className="text-2xl font-bold">
                        #{department.business_school_rank_us}
                      </div>
                    </div>
                  )}
                  {department.medicine_school_rank_us && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Medical School Rank
                      </div>
                      <div className="text-2xl font-bold">
                        #{department.medicine_school_rank_us}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("notableAchievements")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">
                        {t("researchExcellence")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("updateSoon")}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">
                        {t("studentSuccess")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("updateSoon")}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">
                        {t("industryRecognition")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("updateSoon")}
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">
                        {t("academicInnovation")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t("updateSoon")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Programs & Courses */}
            <Card>
              <CardHeader>
                <CardTitle>{t("programsAndCourses")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("degreePrograms")}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {t("updateSoon")}
                    </div>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Master's Programs</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>Master of Science (MS)</li>
                          <li>Master of Arts (MA)</li>
                          <li>Master of Business Administration (MBA)</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Doctoral Programs</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>Doctor of Philosophy (PhD)</li>
                          <li>Doctor of Education (EdD)</li>
                          <li>Professional Doctorate</li>
                        </ul>
                      </div>
                    </div> */}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("specialization")}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {t("updateSoon")}
                    </div>
                    {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Research Focus</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>Advanced Research</li>
                          <li>Applied Studies</li>
                          <li>Interdisciplinary</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Professional</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>Industry Practice</li>
                          <li>Leadership</li>
                          <li>Management</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Technical</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>Advanced Technology</li>
                          <li>Innovation</li>
                          <li>Development</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Academic</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>Teaching</li>
                          <li>Research</li>
                          <li>Scholarship</li>
                        </ul>
                      </div>
                    </div> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Faculty & Research */}
            <Card>
              <CardHeader>
                <CardTitle>{t("facultyAndResearch")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("researchAreas")}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {t("updateSoon")}
                    </div>
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Primary Research</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>Advanced Research Methods</li>
                          <li>Innovation Studies</li>
                          <li>Applied Research</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">
                          Collaborative Projects
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>Industry Partnerships</li>
                          <li>International Research</li>
                          <li>Cross-disciplinary Studies</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Research Centers</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>Innovation Lab</li>
                          <li>Research Institute</li>
                          <li>Development Center</li>
                        </ul>
                      </div>
                    </div> */}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {t("facultyHighlights")}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {t("updateSoon")}
                    </div>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">
                          Distinguished Faculty
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Our department is home to renowned scholars and
                          industry experts who bring extensive experience and
                          knowledge to the classroom and research projects.
                        </p>
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">
                          Research Excellence
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Faculty members regularly publish in top-tier journals
                          and secure significant research funding from
                          prestigious organizations.
                        </p>
                      </div>
                    </div> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-20 space-y-8 h-fit">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t("quickActions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {t("applyNow")}
                </Button>
                <Button variant="outline" className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t("requestInformation")}
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/schools/${school.id}`}>
                    <Building2 className="h-4 w-4 mr-2" />
                    {t("profile")}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Related Departments */}
            <Card>
              <CardHeader>
                <CardTitle>{t("relatedDepartments")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* {mockSchoolDepartments
                  .filter(
                    (d) => d.school_id === school.id && d.id !== department.id
                  )
                  .slice(0, 3)
                  .map((relatedDept) => (
                    <Link
                      key={relatedDept.id}
                      href={`/departments/${relatedDept.id}`}
                      className="block"
                    >
                      <div className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <h4 className="font-medium mb-1">{relatedDept.name}</h4>
                        <div className="flex gap-2 flex-wrap">
                          {relatedDept.qs_world_rank && (
                            <Badge variant="secondary" className="text-xs">
                              QS #{relatedDept.qs_world_rank}
                            </Badge>
                          )}
                          {relatedDept.us_news_rank_world && (
                            <Badge variant="secondary" className="text-xs">
                              US News #{relatedDept.us_news_rank_world}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))} */}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t("contactInformation")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:underline"
                  >
                    {school.website}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {/* <span className="text-sm">{school.phone}</span> */}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {department.name.toLowerCase().replace(/\s+/g, "")}@
                    {school.name.toLowerCase().replace(/\s+/g, "")}.edu
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
