"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { format, isToday, isSameDay } from "date-fns";
import { cn } from "@/utils/utils";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Event } from "@/lib/db/events/event-modify";

interface EventCalendarProps {
  events: Event[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Get events for the selected date
  const selectedDateEvents = events.filter(
    (event) =>
      date &&
      format(new Date(event.start_date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/50">
        <CardTitle className="text-xl flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row">
          <div className="p-6 border-b lg:border-b-0 lg:border-r flex justify-center">
            <div className="w-full max-w-[270px]">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                modifiers={{
                  event: (date) =>
                    events.some(
                      (event) =>
                        format(new Date(event.start_date), "yyyy-MM-dd") ===
                        format(date, "yyyy-MM-dd")
                    ),
                  today: (date) => isToday(date),
                }}
                modifiersStyles={{
                  event: {
                    backgroundColor: "hsl(var(--primary) / 0.7)",
                    color: "hsl(var(--primary-foreground))",
                  },
                  today: {
                    border: "2px solid hsl(var(--primary))",
                  },
                }}
                classNames={{
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  caption_label: "text-sm font-medium",
                  caption_dropdowns:
                    "flex h-7 items-center justify-center gap-1",
                }}
              />
            </div>
          </div>

          <div className="p-6 flex-1">
            <h3 className="font-semibold text-lg mb-6">
              {date ? format(date, "MMMM d, yyyy") : "Select a date"}
            </h3>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedDateEvents.map((event) => (
                  <Link href={`/events/${event.id}`} key={event.id}>
                    <Card className="p-4 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium group-hover:text-primary transition-colors">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {format(
                                new Date(event.start_date),
                                "h:mm a"
                              )} - {format(new Date(event.end_date), "h:mm a")}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.is_virtual
                                ? "Virtual Event"
                                : event.location}
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
                                "bg-purple-100 text-purple-800",
                              event.type === "meetup" &&
                                "bg-orange-100 text-orange-800"
                            )}
                          >
                            {event.type}
                          </Badge>
                          {event.is_virtual && (
                            <Badge
                              variant="secondary"
                              className="bg-indigo-100 text-indigo-800"
                            >
                              Virtual
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No events scheduled for this date.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
