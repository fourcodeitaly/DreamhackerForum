import { ResourceList } from "@/components/resource-list";
import { ResourceCategories } from "@/components/resource-categories";

export const dynamic = "force-dynamic";

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Resources</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <ResourceCategories />
        </div>
        <div className="md:w-3/4">
          <ResourceList />
        </div>
      </div>
    </div>
  );
}
