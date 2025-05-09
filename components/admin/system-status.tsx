"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Clock } from "lucide-react"

// Sample data for system status
const systemStatuses = [
  {
    id: 1,
    name: "Database",
    status: "healthy",
    message: "All systems operational",
    lastChecked: "5 minutes ago",
  },
  {
    id: 2,
    name: "Storage",
    status: "healthy",
    message: "All systems operational",
    lastChecked: "5 minutes ago",
  },
  {
    id: 3,
    name: "Authentication",
    status: "healthy",
    message: "All systems operational",
    lastChecked: "5 minutes ago",
  },
  {
    id: 4,
    name: "Email Service",
    status: "warning",
    message: "Degraded performance",
    lastChecked: "5 minutes ago",
  },
]

export function SystemStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current status of system components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systemStatuses.map((status) => (
            <div key={status.id} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                {status.status === "healthy" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : status.status === "warning" ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium">{status.name}</p>
                  <p className="text-sm text-muted-foreground">{status.message}</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3 w-3" />
                {status.lastChecked}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
