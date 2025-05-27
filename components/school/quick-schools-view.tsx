import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getSchoolByNationOrderByRank } from "@/lib/db/schools/school-get";

export async function QuickSchoolsView() {
  const schools = await getSchoolByNationOrderByRank({
    nationCode: "us",
    limit: 5,
    offset: 0,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building2 className="h-5 w-5 text-primary" />
          Top Schools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schools.map((school) => (
            <Link
              key={school.id}
              href={`/schools/${school.id}`}
              className="block hover:bg-muted/50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3 p-2">
                <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={school.logo || "/placeholder.png"}
                    alt={school.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="font-medium truncate">{school.name}</div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Trophy className="h-3 w-3 text-yellow-500" />
                    <span className="text-yellow-600">
                      #{school.us_news_rank_world}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          <Link
            href="/schools"
            className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View all schools →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
