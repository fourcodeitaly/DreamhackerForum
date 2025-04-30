"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { hasSupabaseCredentials } from "@/lib/supabase/server"

export function EnvChecker() {
  const [hasCredentials, setHasCredentials] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if Supabase credentials are available
    const checkCredentials = async () => {
      const result = hasSupabaseCredentials()
      setHasCredentials(result)
    }

    checkCredentials()
  }, [])

  if (hasCredentials === null) {
    return null // Still loading
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Environment Status</CardTitle>
        <CardDescription>Check if required environment variables are available</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span>Supabase Environment Variables</span>
          {hasCredentials ? (
            <Badge variant="default" className="bg-green-600">
              Available
            </Badge>
          ) : (
            <Badge variant="destructive">Missing</Badge>
          )}
        </div>
        {!hasCredentials && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Supabase environment variables are missing. The application will use mock data instead. To use real data,
              please set up the following environment variables:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>SUPABASE_URL</li>
              <li>SUPABASE_SERVICE_ROLE_KEY</li>
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
