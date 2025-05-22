"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { School } from "@/lib/db/tags/tags-get";

interface SchoolListProps {
  schools: School[];
}

export function SchoolList({ schools }: SchoolListProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {schools.map((school) => (
        <Link href={`/posts?tag=${school.tag_id}`} key={school.schoolcode}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-primary" />
                {school.schoolname}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {/* <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {school.city}, {school.nation}
                </div>
                {school.student_count && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    {school.student_count.toLocaleString()} {t("students")}
                  </div>
                )}
                {school.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {school.description}
                  </p>
                )}
                {school.website && (
                  <Badge variant="secondary" className="mt-2">
                    {t("website")}
                  </Badge>
                )}
              </div> */}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
