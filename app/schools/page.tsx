import { getSchoolByNationOrderByRank } from "@/lib/db/schools/school-get";
import SchoolsList from "@/components/schools/school-list";
import { SchoolNationFilter } from "@/components/schools/school-nation-filter";

interface SchoolsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SchoolsPage({ searchParams }: SchoolsPageProps) {
  const { location } = await searchParams;

  const schools = await getSchoolByNationOrderByRank({
    nationCode: location?.toString(),
    limit: 10,
    offset: 0,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative bg-primary/5 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Explore Top Universities
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover detailed information about leading universities worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <SchoolNationFilter location={location?.toString() || "us"} />
          </div>

          <SchoolsList
            location={location?.toString() || "us"}
            initialSchools={schools}
          />
          {/* Schools List */}
        </div>
      </div>
    </div>
  );
}
