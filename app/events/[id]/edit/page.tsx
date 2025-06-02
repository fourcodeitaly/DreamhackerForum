"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, use } from "react";
import { Event, deleteEvent } from "@/lib/db/events/event-modify";
import { useRouter } from "next/navigation";
import { X, Upload, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AdminCheck } from "@/components/admin/admin-check";

interface EventFormValues {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  type: string;
  capacity: number | null;
  is_virtual: boolean;
  virtual_meeting_link: string;
  image_url: string;
  is_published: boolean;
  organizer_name?: string;
  organizer_email?: string;
  organizer_phone?: string;
  organizer_website?: string;
  organizer_logo?: string;
  organizer_description?: string;
  organizer_location?: string;
  registration_url?: string;
  registration_deadline: string;
  registration_fee: number;
  registration_currency: string;
  registration_type: string;
  registration_status: string;
}

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [isDeleting, setIsDeleting] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(
    null
  );
  const [images, setImages] = useState<File[]>([]);
  const { id } = use(params);

  const form = useForm<EventFormValues>({
    defaultValues: {
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      location: "",
      type: "",
      capacity: null,
      is_virtual: false,
      virtual_meeting_link: "",
      image_url: "",
      is_published: true,
      registration_deadline: "",
      registration_fee: 0,
      registration_currency: "USD",
      registration_type: "free",
      registration_status: "open",
    },
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        const eventData = (await response.json()) as Event;

        if (eventData) {
          setEvent(eventData);
          setEventImagePreview(
            eventData.images?.find((image) =>
              image.image_url.includes("event-image")
            )?.image_url || ""
          );
          form.reset({
            title: eventData.title,
            description: eventData.description,
            start_date: new Date(eventData.start_date)
              .toISOString()
              .slice(0, 16),
            end_date: new Date(eventData.end_date).toISOString().slice(0, 16),
            location: eventData.location,
            type: eventData.type,
            capacity: eventData.capacity || null,
            is_virtual: eventData.is_virtual,
            virtual_meeting_link: eventData.virtual_meeting_link || "",
            image_url: eventData.image_url || "",
            is_published: eventData.is_published,
            organizer_name: eventData.organizer_name,
            organizer_email: eventData.organizer_email,
            organizer_phone: eventData.organizer_phone,
            organizer_website: eventData.organizer_website,
            organizer_logo: eventData.organizer_logo,
            organizer_description: eventData.organizer_description,
            organizer_location: eventData.organizer_location,
            registration_url: eventData.registration_url,
            registration_deadline: new Date(eventData.registration_deadline)
              .toISOString()
              .slice(0, 16),
            registration_fee: eventData.registration_fee,
            registration_currency: eventData.registration_currency,
            registration_type: eventData.registration_type,
            registration_status: eventData.registration_status,
          });
        } else {
          router.push("/events");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        router.push("/events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id, router, form]);

  const handleRemoveEventImage = async () => {
    try {
      const response = await fetch(
        `/api/events/${id}/images/${
          event?.images?.find((image) =>
            image.image_url.includes("event-image")
          )?.id
        }`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete image");
      }

      setEventImagePreview("");
      setEventImage(null);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleEventImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteEvent(id);
      if (success) {
        router.push("/events");
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  async function onSubmit(data: EventFormValues) {
    setIsSubmitting("loading");
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedEvent = (await response.json()) as Event;

        if (images.length > 0 || eventImage) {
          const formData = new FormData();
          images.forEach((file) => {
            formData.append("files", file);
          });
          formData.append("eventId", updatedEvent.id);
          if (eventImage) {
            formData.append("eventImage", eventImage);
          }

          const uploadResponse = await fetch("/api/uploads", {
            method: "POST",
            body: formData,
          });

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload images");
          }
        }

        router.push(`/events/${updatedEvent.id}`);
      } else if (response.status === 400) {
        setIsSubmitting("error");
      } else {
        throw new Error("Failed to update event");
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting("error");
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <AdminCheck>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Edit Event</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Event
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the event and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Title is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Event title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    rules={{ required: "Type is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="conference">
                              Conference
                            </SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                            <SelectItem value="seminar">Seminar</SelectItem>
                            <SelectItem value="meetup">Meetup</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="start_date"
                    rules={{ required: "Start date is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    rules={{ required: "End date is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Event location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Maximum attendees"
                            value={field.value === null ? "" : field.value}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val === "" ? null : Number(val));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: "Description is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Event description"
                            className="min-h-[200px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Event Image</h3>
                  <div className="flex gap-6">
                    {eventImagePreview && (
                      <div className="relative aspect-square max-h-[200px]">
                        <img
                          src={eventImagePreview}
                          alt="Event Image"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={handleRemoveEventImage}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove Image</span>
                        </Button>
                      </div>
                    )}
                    <div className="border-2 border-dashed rounded-md p-4 text-center aspect-square flex flex-col items-center justify-center max-h-[200px]">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop event image
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() =>
                          document.getElementById("event-image-upload")?.click()
                        }
                      >
                        Select Event Image
                      </Button>
                      <Input
                        id="event-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleEventImageChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Organizer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="organizer_name"
                      rules={{ required: "Organizer name is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizer Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Organizer name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="organizer_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizer Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Organizer email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="organizer_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizer Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Organizer phone"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="organizer_website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizer Website</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="Organizer website"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="organizer_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organizer Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Organizer description"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Registration Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="registration_url"
                      rules={{ required: "Registration URL is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration URL</FormLabel>
                          <FormControl>
                            <Input placeholder="Registration URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="registration_deadline"
                      rules={{ required: "Registration deadline is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Deadline</FormLabel>
                          <FormControl>
                            <Input type="datetime-local" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="registration_type"
                      rules={{ required: "Registration type is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select registration type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="invitation">
                                Invitation Only
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="registration_status"
                      rules={{ required: "Registration status is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select registration status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                              <SelectItem value="waitlist">Waitlist</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting === "loading"}>
                    {isSubmitting === "loading"
                      ? "Saving..."
                      : isSubmitting === "error"
                      ? "Error"
                      : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminCheck>
  );
}
