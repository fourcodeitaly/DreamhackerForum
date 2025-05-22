import { EventCalendar } from "@/components/events/event-calendar";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar as CalendarIcon, List } from "lucide-react";
import Link from "next/link";
import { getMockEvents } from "@/lib/mock/events";
import { EventList } from "@/components/events/event-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getMockEvents();

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
                      src={event.imageUrl}
                      alt={event.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
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
        <Tabs defaultValue="calendar" className="space-y-8">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Calendar View
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List View
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
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(event.startDate).toLocaleDateString()}
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
