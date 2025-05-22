import { SchoolList } from "@/components/schools/school-list";
import { NationGroups } from "@/components/schools/nation-groups";
import { getSchoolsGroupByNationCode, School } from "@/lib/db/tags/tags-get";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SchoolsPage({
  searchParams,
}: {
  searchParams: { nation?: string };
}) {
  // Fetch all schools
  const schoolsGroupByNationCode = await getSchoolsGroupByNationCode();
  const nations = Object.keys(schoolsGroupByNationCode);

  // Get the selected nation from URL params or default to the first nation
  const selectedNation = searchParams.nation || "United States";

  // If the selected nation doesn't exist, show 404
  if (!schoolsGroupByNationCode[selectedNation]) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Schools</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar - Nation Groups */}
        <div className="lg:w-1/4">
          <div className="sticky top-20">
            <NationGroups nations={nations} selectedNation={selectedNation} />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:w-3/4">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{selectedNation}</h2>
            <SchoolList schools={schoolsGroupByNationCode[selectedNation]} />
          </div>
        </div>
      </div>
    </div>
  );
}
