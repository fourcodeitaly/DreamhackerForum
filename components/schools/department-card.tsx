import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SchoolDepartment } from "@/lib/db/departments/department-get";

interface DepartmentCardProps {
  department: SchoolDepartment;
}

export function DepartmentCard({ department }: DepartmentCardProps) {
  const acceptanceRate =
    (department.number_of_admissions / department.number_of_applications) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Link
              href={`/schools/${department.school_id}/departments/${department.id}`}
            >
              <CardTitle className="text-2xl font-bold hover:underline">
                {department.name}
              </CardTitle>
            </Link>
            {/* <div className="flex gap-2 mt-2">
              {department.law_school_rank_us && (
                <Badge variant="secondary">
                  Law School Rank: #{department.law_school_rank_us}
                </Badge>
              )}
              {department.business_school_rank_us && (
                <Badge variant="secondary">
                  Business School Rank: #{department.business_school_rank_us}
                </Badge>
              )}
              {department.medicine_school_rank_us && (
                <Badge variant="secondary">
                  Medical School Rank: #{department.medicine_school_rank_us}
                </Badge>
              )}
            </div> */}
          </div>
          {/* <div className="flex gap-2">
            {department.law_school_rank_us && (
              <Badge variant="outline">
                Law School Rank: #{department.law_school_rank_us}
              </Badge>
            )}
            {department.business_school_rank_us && (
              <Badge variant="outline">
                Business School Rank: #{department.business_school_rank_us}
              </Badge>
            )}
            {department.medicine_school_rank_us && (
              <Badge variant="outline">
                Medical School Rank: #{department.medicine_school_rank_us}
              </Badge>
            )}
          </div> */}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Admission Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Admission Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">
                  {department.number_of_applications.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Admissions</p>
                <p className="text-2xl font-bold">
                  {department.number_of_admissions.toLocaleString()}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Acceptance Rate</p>
                <p className="text-2xl font-bold">
                  {acceptanceRate.toFixed(1)}%
                </p>
              </div>
            </div>
            <Progress value={acceptanceRate} className="mt-2" />
          </div>

          {/* Admission Requirements */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Admission Requirements
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Requirement</TableHead>
                  <TableHead>Minimum</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">GPA</TableCell>
                  <TableCell>{department.admission_requirements.gpa}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">GRE Verbal</TableCell>
                  <TableCell>{department.admission_requirements.gre}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">GRE</TableCell>
                  <TableCell>{department.admission_requirements.gre}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">TOEFL</TableCell>
                  <TableCell>
                    {department.admission_requirements.toefl}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">IELTS</TableCell>
                  <TableCell>Updated Soon</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">GMAT</TableCell>
                  <TableCell>Updated Soon</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <Link
              href={`/schools/${department.school_id}/departments/${department.id}`}
            >
              <Button variant="outline">
                View Full Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
