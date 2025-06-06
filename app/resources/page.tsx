import { ResourceList } from "@/components/resource-list";
import { ResourceCategories } from "@/components/resource-categories";
import { getMockResources } from "@/mocks/mock-data";

export const dynamic = "force-dynamic";

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const { category } = await searchParams;
  const data = getMockResources();

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Resources</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <ResourceCategories />
        </div>
        <div className="md:w-3/4">
          <ResourceList resources={data} />
        </div>
      </div>
    </div>
  );
}
