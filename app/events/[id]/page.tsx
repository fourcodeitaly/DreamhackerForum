import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/utils/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Share2,
  BookmarkPlus,
  Globe,
  Mail,
  Phone,
  Edit,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/db/events/event-get";
import { getServerSession } from "next-auth";
import Link from "next/link";

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEventById(id);
  const session = await getServerSession();
  const user = session?.user;
  const canEdit = user?.role === "admin" || user?.id === event?.created_user_id;

  const eventImage = event?.images?.find((image) =>
    image.image_url.includes("event-image")
  )?.image_url;

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative bg-primary/5 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {eventImage && (
              <div className="relative w-full h-[300px] mb-8 rounded-lg overflow-hidden">
                <img
                  src={eventImage}
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
                  event.type === "conference" &&
                    "bg-purple-100 text-purple-800",
                  event.type === "meetup" && "bg-orange-100 text-orange-800"
                )}
              >
                {event.type}
              </Badge>
              {event.is_virtual && (
                <Badge
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-800"
                >
                  Virtual Event
                </Badge>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {format(event.start_date, "EEEE, MMMM d, yyyy")}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {event.title}
            </h1>

            <div className="flex flex-col gap-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.is_virtual ? "Virtual Event" : event.location}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {format(event.start_date, "h:mm a")} -{" "}
                {format(event.end_date, "h:mm a")}
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Button
                size="lg"
                className="rounded-full"
                disabled={event.registration_deadline <= new Date()}
                // onClick={() => window.open(event.registrationUrl, "_blank")}
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
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {event.title}
                    </CardTitle>
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
                  {canEdit && (
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href={`/events/${event.id}/edit`}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Event
                      </Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground mb-6">
                    {event.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">Date & Time</h3>
                      <p className="text-muted-foreground">
                        {format(new Date(event.start_date), "PPP")} -{" "}
                        {format(new Date(event.end_date), "PPP")}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Location</h3>
                      <p className="text-muted-foreground">
                        {event.is_virtual ? "Virtual Event" : event.location}
                      </p>
                    </div>
                  </div>
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
                        {format(event.start_date, "EEEE, MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(event.start_date, "h:mm a")} -{" "}
                        {format(event.end_date, "h:mm a")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.is_virtual ? "Virtual Event" : event.location}
                      </p>
                      {event.is_virtual && event.virtual_meeting_link && (
                        <a
                          href={event.virtual_meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          Join Meeting
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Organizer</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.organizer_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.organizer_location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="font-medium">Registration Deadline</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(event.registration_deadline, "MMMM d, yyyy")} at{" "}
                        {format(event.registration_deadline, "h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organizer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.organizer_logo && (
                    <div className="flex items-center justify-center p-4">
                      <img
                        src={event.organizer_logo}
                        alt={event.organizer_name}
                        className="max-h-24 object-contain"
                      />
                    </div>
                  )}
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      {event.organizer_description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {event.organizer_email && (
                          <>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`mailto:${event.organizer_email}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {event.organizer_email}
                            </a>
                          </>
                        )}
                        {event.organizer_phone && (
                          <>
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={`tel:${event.organizer_phone}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {event.organizer_phone}
                            </a>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {event.organizer_website && (
                          <>
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <a
                              href={event.organizer_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline"
                            >
                              {event.organizer_website}
                            </a>
                          </>
                        )}
                      </div>
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Registration Type
                    </span>
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
                  {event.registration_type === "paid" && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Registration Fee
                      </span>
                      <span className="font-medium">
                        {event.registration_fee} {event.registration_currency}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Registration Deadline
                    </span>
                    <span className="font-medium">
                      {format(new Date(event.registration_deadline), "PPP")}
                    </span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={event.registration_deadline <= new Date()}
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
