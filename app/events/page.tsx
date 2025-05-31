import { EventCalendar } from "@/components/events/event-calendar";
import {
  Calendar as CalendarIcon,
  List,
  MapPin,
  Users,
  Globe,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { getEvents } from "@/lib/db/events/event-get";
import { EventList } from "@/components/events/event-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerTranslation } from "@/lib/get-translation";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const { t } = await getServerTranslation();
  const [{ events }, session] = await Promise.all([
    getEvents(),
    getServerSession(authOptions),
  ]);
  const isAdmin = session?.user?.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Image Carousel */}
      <div className="container mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-xl">
          <div className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {events.map((event) => (
              <div key={event.id} className="flex-none w-[300px] snap-start">
                <Link href={`/events/${event.id}`}>
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden group">
                    <img
                      src={
                        event.images.find((image) =>
                          image.image_url.includes("event-image")
                        )?.image_url
                      }
                      alt={event.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "capitalize text-sm",
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
                      <h3 className="font-semibold text-lg mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-white/80 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {isAdmin && (
          <Button asChild className="mb-4">
            <Link href="/events/create" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("createEvent")}
            </Link>
          </Button>
        )}

        <Tabs defaultValue="calendar" className="space-y-8">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                {t("calendarView")}
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                {t("listView")}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="calendar" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <EventCalendar events={events} />
              </div>
              <div className="lg:col-span-1">
                <EventList events={events} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link href={`/events/${event.id}`} key={event.id}>
                  <div className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-all">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "capitalize text-sm",
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
                        <Badge
                          variant="secondary"
                          className={cn(
                            "capitalize",
                            event.registration_type === "free" &&
                              "bg-green-100 text-green-800",
                            event.registration_type === "paid" &&
                              "bg-blue-100 text-blue-800",
                            event.registration_type === "invitation" &&
                              "bg-purple-100 text-purple-800"
                          )}
                        >
                          {event.registration_type}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {event.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          {format(event.start_date, "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.is_virtual ? "Virtual Event" : event.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {event.organizer_name}
                        </div>
                        {event.registration_type === "paid" && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            {event.registration_fee}{" "}
                            {event.registration_currency}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
