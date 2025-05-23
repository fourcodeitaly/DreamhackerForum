import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  GraduationCap,
  BookOpen,
  Globe,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import { getMockSchools } from "@/lib/mock/schools";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SchoolProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const schools = await getMockSchools();
  const school = schools.find((s) => s.id === params.id);

  if (!school) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative">
        {/* Hero Image */}
        <div className="h-[400px] relative">
          <Image
            src={school.images[0]}
            alt={school.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl">
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 relative rounded-lg overflow-hidden flex-shrink-0 bg-white">
                    <Image
                      src={school.logo}
                      alt={school.name}
                      fill
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="text-white">
                    <h1 className="text-4xl font-bold mb-2">{school.name}</h1>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        <Trophy className="h-4 w-4 mr-1" />
                        Rank #{school.ranking}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{school.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="capitalize">{school.type}</span>
                      </div>
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
                <p className="text-muted-foreground mb-6">
                  {school.description}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                    <Users className="h-6 w-6 mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {school.totalStudents.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Students
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                    <Activity className="h-6 w-6 mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      {school.acceptanceRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Acceptance Rate
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                    <DollarSign className="h-6 w-6 mb-2 text-primary" />
                    <div className="text-2xl font-bold">
                      ${school.tuition.inState.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      In-State Tuition
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-lg">
                    <Calendar className="h-6 w-6 mb-2 text-primary" />
                    <div className="text-2xl font-bold">{school.founded}</div>
                    <div className="text-sm text-muted-foreground">Founded</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="academics" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="academics">Academics</TabsTrigger>
                    <TabsTrigger value="admissions">Admissions</TabsTrigger>
                    <TabsTrigger value="campus">Campus Life</TabsTrigger>
                    <TabsTrigger value="costs">Costs & Aid</TabsTrigger>
                  </TabsList>

                  <TabsContent value="academics" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-4">Popular Majors</h4>
                        <div className="flex flex-wrap gap-2">
                          {school.popularMajors.map((major) => (
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
                      <div>
                        <h4 className="font-medium mb-4">Academic Calendar</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Semester System
                            </div>
                            <div className="font-medium">Fall & Spring</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Summer Session
                            </div>
                            <div className="font-medium">Available</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="admissions" className="mt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Average GPA
                          </div>
                          <div className="text-2xl font-bold">
                            {school.averageGPA}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Average SAT
                          </div>
                          <div className="text-2xl font-bold">
                            {school.averageSAT}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Average ACT
                          </div>
                          <div className="text-2xl font-bold">
                            {school.averageACT}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Acceptance Rate
                          </div>
                          <div className="text-2xl font-bold">
                            {school.acceptanceRate}%
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-4">
                          Application Deadlines
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Early Decision
                            </div>
                            <div className="font-medium">November 1</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Regular Decision
                            </div>
                            <div className="font-medium">January 15</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="campus" className="mt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Student Clubs
                          </div>
                          <div className="text-2xl font-bold">
                            {school.campusLife.studentClubs}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Sports Teams
                          </div>
                          <div className="text-2xl font-bold">
                            {school.campusLife.sportsTeams}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-4">Housing Options</h4>
                        <div className="flex flex-wrap gap-2">
                          {school.campusLife.housingOptions.map((option) => (
                            <Badge
                              key={option}
                              variant="secondary"
                              className="text-sm"
                            >
                              {option}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="costs" className="mt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">
                            In-State Tuition
                          </div>
                          <div className="text-2xl font-bold">
                            ${school.tuition.inState.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Out-of-State Tuition
                          </div>
                          <div className="text-2xl font-bold">
                            ${school.tuition.outState.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Room & Board
                          </div>
                          <div className="text-2xl font-bold">$15,000</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Books & Supplies
                          </div>
                          <div className="text-2xl font-bold">$1,200</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-4">Financial Aid</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Students Receiving Aid
                            </div>
                            <div className="font-medium">65%</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Average Aid Package
                            </div>
                            <div className="font-medium">$35,000</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Related Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={school.images[0]}
                          alt="Post thumbnail"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">
                          Student Experience at {school.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          A detailed look at campus life, academics, and student
                          activities...
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>By John Doe</span>
                          <span>•</span>
                          <span>2 days ago</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
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
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </Button>
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
                  <span className="text-sm">(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    admissions@{school.name.toLowerCase().replace(/\s+/g, "")}
                    .edu
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Youtube className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Similar Schools */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Schools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schools
                    .filter((s) => s.id !== school.id)
                    .slice(0, 3)
                    .map((similarSchool) => (
                      <Link
                        key={similarSchool.id}
                        href={`/schools/${similarSchool.id}`}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0 bg-white">
                          <Image
                            src={similarSchool.logo}
                            alt={similarSchool.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div>
                          <div className="font-medium">
                            {similarSchool.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {similarSchool.location}
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
