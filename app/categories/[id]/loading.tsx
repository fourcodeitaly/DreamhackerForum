export default function Loading() {
  return (
    <div className="container max-w-8xl py-8">
      <div className="mb-6">
        {/* Back button skeleton */}
        <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Post detail skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Comments skeleton */}
      <div className="mt-8 space-y-4">
        <div className="h-24 bg-gray-200 rounded animate-pulse" />
        <div className="h-24 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Related posts skeleton */}
      <div className="mt-12">
        <div className="h-48 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}
