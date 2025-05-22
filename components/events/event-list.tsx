"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/utils/utils";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  type: "workshop" | "seminar" | "conference" | "other";
}

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  // Sort events by start date and get upcoming events
  const upcomingEvents = [...events]
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
    .filter((event) => new Date(event.startDate) >= new Date())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="border-b bg-muted/50">
        <CardTitle className="text-xl flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id}>
              <Card className="p-4 hover:shadow-md transition-all group my-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h4 className="font-medium group-hover:text-primary transition-colors">
                      {event.title}
                    </h4>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {format(
                          new Date(event.startDate),
                          "MMM d, yyyy"
                        )} at {format(new Date(event.startDate), "h:mm a")}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "capitalize",
                        event.type === "workshop" &&
                          "bg-blue-100 text-blue-800",
                        event.type === "seminar" &&
                          "bg-green-100 text-green-800",
                        event.type === "conference" &&
                          "bg-purple-100 text-purple-800"
                      )}
                    >
                      {event.type}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {upcomingEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No upcoming events scheduled.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
