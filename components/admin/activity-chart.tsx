"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for the chart
const activityData = [
  { date: "Jan", posts: 12, comments: 24, users: 5 },
  { date: "Feb", posts: 18, comments: 36, users: 8 },
  { date: "Mar", posts: 15, comments: 42, users: 12 },
  { date: "Apr", posts: 25, comments: 55, users: 15 },
  { date: "May", posts: 32, comments: 70, users: 20 },
  { date: "Jun", posts: 28, comments: 65, users: 18 },
  { date: "Jul", posts: 35, comments: 78, users: 25 },
]

export function ActivityChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Forum Activity</CardTitle>
        <CardDescription>Monthly posts, comments, and new user registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            posts: {
              label: "Posts",
              color: "hsl(var(--chart-1))",
            },
            comments: {
              label: "Comments",
              color: "hsl(var(--chart-2))",
            },
            users: {
              label: "New Users",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="posts" stroke="var(--color-posts)" strokeWidth={2} />
              <Line type="monotone" dataKey="comments" stroke="var(--color-comments)" strokeWidth={2} />
              <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
