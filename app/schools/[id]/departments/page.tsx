"use client";

import { useEffect, useState } from "react";
import { DepartmentCard } from "@/components/schools/department-card";
import { SchoolDepartment } from "@/lib/mock/school-departments";
import { mockSchoolDepartments } from "@/lib/mock/school-departments";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SchoolDepartmentsPageProps {
  params: {
    id: string;
  };
}

export default function SchoolDepartmentsPage({
  params,
}: SchoolDepartmentsPageProps) {
  const [departments, setDepartments] = useState<SchoolDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API call
    const schoolDepartments = mockSchoolDepartments.filter(
      (dept) => dept.school_id === params.id
    );
    setDepartments(schoolDepartments);
    setIsLoading(false);
  }, [params.id]);

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

  const lawDepartments = departments.filter(
    (dept) => dept.law_school_rank_us !== null
  );
  const businessDepartments = departments.filter(
    (dept) => dept.business_school_rank_us !== null
  );
  const medicalDepartments = departments.filter(
    (dept) => dept.medicine_school_rank_us !== null
  );

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Departments</TabsTrigger>
          <TabsTrigger value="law">Law Schools</TabsTrigger>
          <TabsTrigger value="business">Business Schools</TabsTrigger>
          <TabsTrigger value="medical">Medical Schools</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {departments.map((department) => (
            <DepartmentCard key={department.id} department={department} />
          ))}
        </TabsContent>

        <TabsContent value="law" className="space-y-4">
          {lawDepartments.map((department) => (
            <DepartmentCard key={department.id} department={department} />
          ))}
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          {businessDepartments.map((department) => (
            <DepartmentCard key={department.id} department={department} />
          ))}
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          {medicalDepartments.map((department) => (
            <DepartmentCard key={department.id} department={department} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
