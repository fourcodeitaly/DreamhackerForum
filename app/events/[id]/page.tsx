import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/utils/utils";
import { getMockEvents } from "@/lib/mock/events";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  BookmarkPlus,
} from "lucide-react";
import { notFound } from "next/navigation";

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  // TODO: Replace with actual API call
  const { id } = await params;
  const events = getMockEvents();
  const event = events.find((e) => e.id === id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative bg-primary/5 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {event.imageUrl && (
              <div className="relative w-full h-[300px] mb-8 rounded-lg overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <Badge
                variant="secondary"
                className={cn(
                  "capitalize text-sm",
                  event.type === "workshop" && "bg-blue-100 text-blue-800",
                  event.type === "seminar" && "bg-green-100 text-green-800",
                  event.type === "conference" && "bg-purple-100 text-purple-800"
                )}
              >
                {event.type}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(event.startDate, "EEEE, MMMM d, yyyy")}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {event.title}
            </h1>

            <div className="flex items-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {format(event.startDate, "h:mm a")} -{" "}
                {format(event.endDate, "h:mm a")}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                size="lg"
                className="rounded-full"
                disabled={event.registrationDeadline <= new Date()}
              >
                Register Now
              </Button>
              <Button variant="outline" size="lg" className="rounded-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="lg" className="rounded-full">
                <BookmarkPlus className="mr-2 h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground">{event.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Date & Time</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(event.startDate, "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(event.startDate, "h:mm a")} -{" "}
                        {format(event.endDate, "h:mm a")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Organizer</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.organizer}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Registration Deadline</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(event.registrationDeadline, "MMMM d, yyyy")} at{" "}
                        {format(event.registrationDeadline, "h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium">Capacity</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.capacity} participants
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium">Registration Status</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.registrationDeadline > new Date()
                        ? "Open for registration"
                        : "Registration closed"}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={event.registrationDeadline <= new Date()}
                  >
                    Register Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Share This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Button variant="outline" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <BookmarkPlus className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
