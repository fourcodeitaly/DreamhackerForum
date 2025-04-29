import { hasSupabaseCredentials } from "@/lib/supabase"

export async function ServerEnvChecker() {
  const hasCredentials = hasSupabaseCredentials()

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  return (
    <div className="mb-6 p-4 rounded-lg border bg-amber-50 text-amber-800 border-amber-200">
      <h3 className="text-lg font-medium">Environment Status</h3>
      <p className="text-sm mt-1">Supabase Environment Variables: {hasCredentials ? "✅ Available" : "❌ Missing"}</p>
      {!hasCredentials && (
        <div className="mt-2 text-sm">
          <p>The application will use mock data. To use real data, please set up the required environment variables.</p>
        </div>
      )}
    </div>
  )
}
