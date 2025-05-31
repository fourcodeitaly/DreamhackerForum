import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowUpDown } from "lucide-react";
import { getMockSchools } from "@/lib/mock/schools";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function CompareSchoolsPage() {
  const schools = await getMockSchools();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative bg-primary/5 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Compare Universities
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Compare universities side by side to make an informed decision
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* School Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Schools to Compare</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    <option value="">Select schools to compare</option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                  <Button variant="outline" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {schools.slice(0, 3).map((school) => (
                    <Badge
                      key={school.id}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      {school.name}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">School</TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          Ranking
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          Total Students
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          Acceptance Rate
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          Average GPA
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          Average SAT
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          International Tuition
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={school.logo}
                                alt={school.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{school.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {school.popularMajors.slice(0, 2).join(", ")}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            #{school.ranking}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {school.totalStudents.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          {school.acceptanceRate}%
                        </TableCell>
                        <TableCell className="text-center">
                          {school.averageGPA}
                        </TableCell>
                        <TableCell className="text-center">
                          {school.averageSAT}
                        </TableCell>
                        <TableCell className="text-center">
                          {school.tuition.international}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
