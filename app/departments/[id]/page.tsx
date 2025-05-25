"use client";

import { use, useEffect, useState } from "react";
import { SchoolDepartment } from "@/lib/mock/school-departments";
import { School } from "@/lib/mock/schools";
import { mockSchoolDepartments } from "@/lib/mock/school-departments";
import { getMockSchools } from "@/lib/mock/schools";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Users,
  Trophy,
  Calendar,
  MapPin,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Globe,
  Phone,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DepartmentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DepartmentPage({ params }: DepartmentPageProps) {
  const [department, setDepartment] = useState<SchoolDepartment | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = use(params);

  useEffect(() => {
    const fetchData = async () => {
      const departments = mockSchoolDepartments;
      const schools = await getMockSchools();

      const departmentData = departments.find((d) => d.id === id);
      const schoolData = schools.find(
        (s) => s.id === departmentData?.school_id
      );

      setDepartment(departmentData || null);
      setSchool(schoolData || null);
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <Image
            src={school.images[0]}
            alt={department.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0 bg-white">
                    <Image
                      src={school.logo}
                      alt={school.name}
                      fill
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
                      {department.qs_world_rank && (
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          <Trophy className="h-4 w-4 mr-1" />
                          QS World Rank #{department.qs_world_rank}
                        </Badge>
                      )}
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
                      Applications
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                    <Users className="h-6 w-6 mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {department.number_of_admissions.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Admissions
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                    <Trophy className="h-6 w-6 mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {acceptanceRate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Acceptance Rate
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                    <Building2 className="h-6 w-6 mb-2 text-primary" />
                    <div className="text-2xl font-bold">{school.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Institution
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      About the Department
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
                    <h3 className="text-lg font-semibold mb-2">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <GraduationCap className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Academic Excellence</h4>
                          <p className="text-sm text-muted-foreground">
                            World-class faculty and cutting-edge research
                            facilities
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Users className="h-5 w-5 text-primary mt-1" />
                        <div>
                          <h4 className="font-medium">Diverse Community</h4>
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
                            Research Opportunities
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
                          <h4 className="font-medium">Global Network</h4>
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
                <CardTitle>Rankings & Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {department.qs_world_rank && (
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
                  )}
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
                    Notable Achievements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Research Excellence</h4>
                      <p className="text-sm text-muted-foreground">
                        Leading research in key areas with significant funding
                        and publications
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Student Success</h4>
                      <p className="text-sm text-muted-foreground">
                        High employment rates and successful alumni in various
                        industries
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Industry Recognition</h4>
                      <p className="text-sm text-muted-foreground">
                        Strong partnerships with leading companies and
                        organizations
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Academic Innovation</h4>
                      <p className="text-sm text-muted-foreground">
                        Pioneering new teaching methods and curriculum
                        development
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Programs & Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Programs & Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Degree Programs
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Specializations
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Faculty & Research */}
            <Card>
              <CardHeader>
                <CardTitle>Faculty & Research</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Research Areas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Faculty Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
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
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
                <Button variant="outline" className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Request Information
                </Button>
                <Link href={`/schools/${school.id}`}>
                  <Button variant="outline" className="w-full">
                    <Building2 className="h-4 w-4 mr-2" />
                    View School Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Related Departments */}
            <Card>
              <CardHeader>
                <CardTitle>Related Departments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSchoolDepartments
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
                  ))}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
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
