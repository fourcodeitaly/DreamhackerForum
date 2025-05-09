"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Sample data for recent activity
const recentActivities = [
  {
    id: 1,
    user: {
      name: "Alice Johnson",
      username: "alice",
      avatar: "/abstract-geometric-shapes.png",
    },
    action: "created a new post",
    target: "Study Tips for IELTS",
    time: "2 hours ago",
    type: "post",
  },
  {
    id: 2,
    user: {
      name: "Bob Smith",
      username: "bobsmith",
      avatar: "/abstract-geometric-shapes.png",
    },
    action: "commented on",
    target: "How to Prepare for University Interviews",
    time: "3 hours ago",
    type: "comment",
  },
  {
    id: 3,
    user: {
      name: "Carol Davis",
      username: "carol",
      avatar: "/abstract-geometric-shapes.png",
    },
    action: "registered",
    target: "",
    time: "5 hours ago",
    type: "user",
  },
  {
    id: 4,
    user: {
      name: "David Wilson",
      username: "david",
      avatar: "/abstract-geometric-shapes.png",
    },
    action: "reported a comment on",
    target: "Scholarship Application Strategies",
    time: "6 hours ago",
    type: "report",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions across the forum</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-xs text-muted-foreground">@{activity.user.username}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.action} {activity.target && <span className="font-medium">{activity.target}</span>}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
