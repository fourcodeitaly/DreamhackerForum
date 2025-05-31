import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/utils/utils";
import { Clock, MapPin, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { Event } from "@/lib/db/events/event-modify";
import { getServerTranslation } from "@/lib/get-translation";

interface EventListProps {
  events: Event[];
}

export async function EventList({ events }: EventListProps) {
  const { t } = await getServerTranslation();

  // Sort events by start date and get upcoming events
  const upcomingEvents = [...events]
    .sort(
      (a, b) =>
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    )
    .filter((event) => new Date(event.start_date) >= new Date())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="border-b bg-muted/50">
        <CardTitle className="text-xl flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          {t("upcomingEvents")}
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
                          new Date(event.start_date),
                          "MMM d, yyyy"
                        )} at {format(new Date(event.start_date), "h:mm a")}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.is_virtual ? t("virtual") : event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event.organizer_name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end gap-2">
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
                          {t("virtual")}
                        </Badge>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {upcomingEvents.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t("noUpcomingEvents")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
