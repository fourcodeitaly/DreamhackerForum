"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Event, updateEvent } from "@/lib/db/events/event-modify";
import { getEventById } from "@/lib/db/events/event-get";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = use(params);

  useEffect(() => {
    const fetchEvent = async () => {
      const event = await getEventById(id);
      if (event) {
        setEvent(event);
      } else {
        router.push("/events");
      }
    };

    fetchEvent();
    setIsLoading(false);
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const eventData: Partial<Event> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      location: formData.get("location") as string,
      type: formData.get("type") as Event["type"],
      capacity: parseInt(formData.get("capacity") as string) || undefined,
      start_date: new Date(formData.get("start_date") as string),
      end_date: new Date(formData.get("end_date") as string),
      registration_deadline: new Date(
        formData.get("registration_deadline") as string
      ),
    };

    try {
      const updatedEvent = await updateEvent(id, eventData);

      if (updatedEvent) {
        router.push(`/events/${id}`);
      } else {
        throw new Error("Failed to update event");
      }
    } catch (error) {
      console.error("Failed to update event", error);
    }
  };

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
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                required
                defaultValue={event.title}
                placeholder="Enter event title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                defaultValue={event.description}
                placeholder="Enter event description"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Event Image</Label>
              {/* <ImageUpload
                value={event.image_url}
                onChange={(url) => {
                  const form = document.querySelector("form");
                  if (form) {
                    const input = form.querySelector('input[name="image_url"]');
                    if (input) {
                      (input as HTMLInputElement).value = url;
                    }
                  }
                }}
                onRemove={() => {
                  const form = document.querySelector("form");
                  if (form) {
                    const input = form.querySelector('input[name="image_url"]');
                    if (input) {
                      (input as HTMLInputElement).value = "";
                    }
                  }
                }}
              /> */}
              <input
                type="hidden"
                name="image_url"
                defaultValue={event.image_url}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select name="type" required defaultValue={event.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  required
                  defaultValue={event.location}
                  placeholder="Enter event location"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="datetime-local"
                  required
                  defaultValue={format(
                    new Date(event.start_date),
                    "yyyy-MM-dd'T'HH:mm"
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="datetime-local"
                  required
                  defaultValue={format(
                    new Date(event.end_date),
                    "yyyy-MM-dd'T'HH:mm"
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  name="organizer"
                  required
                  defaultValue={event.organizer_name}
                  placeholder="Enter organizer name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  defaultValue={event.capacity}
                  placeholder="Enter maximum capacity"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_deadline">
                Registration Deadline
              </Label>
              <Input
                id="registration_deadline"
                name="registration_deadline"
                type="datetime-local"
                required
                defaultValue={format(
                  new Date(event.registration_deadline),
                  "yyyy-MM-dd'T'HH:mm"
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
