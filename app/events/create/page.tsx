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
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Event } from "@/lib/db/events/event-modify";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Upload } from "lucide-react";
import { AdminCheck } from "@/components/admin/admin-check";

// Define the form values type
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

const defaultValues: EventFormValues = {
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
  is_published: false,
  organizer_name: "",
  organizer_email: "",
  organizer_phone: "",
  organizer_website: "",
  organizer_logo: "",
  organizer_description: "",
  organizer_location: "",
  registration_url: "",
  registration_deadline: "",
  registration_fee: 0,
  registration_currency: "USD",
  registration_type: "free",
  registration_status: "open",
};

export default function CreateEventPage() {
  const [isSubmitting, setIsSubmitting] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const router = useRouter();
  const form = useForm<EventFormValues>({
    defaultValues,
  });
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(
    null
  );
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleEventImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setEventImage(file);
      setEventImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Create temporary preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    setImages(images.filter((_, i) => i !== index));
  };

  async function onSubmit(data: EventFormValues) {
    setIsSubmitting("loading");
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const event = (await response.json()) as Event;

        if (images.length > 0) {
          const formData = new FormData();
          images.forEach((file) => {
            formData.append("files", file);
          });
          formData.append("eventId", event.id);
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

        router.push(`/events/${event.id}`);
      } else if (response.status === 400) {
        setIsSubmitting("error");
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting("error");
    }
  }

  return (
    <AdminCheck>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
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
                  <div className="flex flex-col gap-6">
                    <FormField
                      control={form.control}
                      name="is_virtual"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Virtual Event
                            </FormLabel>
                            <FormDescription>
                              Enable if this is a virtual event
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {form.watch("is_virtual") && (
                      <FormField
                        control={form.control}
                        name="virtual_meeting_link"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Virtual Meeting Link</FormLabel>
                            <FormControl>
                              <Input placeholder="Meeting URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
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
                          onClick={() => {
                            setEventImagePreview(null);
                            setEventImage(null);
                          }}
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
                  <FormField
                    control={form.control}
                    name="is_published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Published</FormLabel>
                          <FormDescription>
                            Make this event visible to the public
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <div className="space-y-2">
                    <Label htmlFor="images">Images</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={() => handleRemoveImage(index)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove Image</span>
                          </Button>
                        </div>
                      ))}
                      <div className="border-2 border-dashed rounded-md p-4 text-center aspect-square flex flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                          Drag and drop images
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                          onClick={() =>
                            document.getElementById("images-upload")?.click()
                          }
                        >
                          Select Images
                        </Button>
                        <Input
                          id="images-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
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
                    <FormField
                      control={form.control}
                      name="organizer_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizer Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Organizer phone" {...field} />
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
                            <Input placeholder="Organizer website" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="organizer_logo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizer Logo URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Organizer logo URL"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="organizer_location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizer Location</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Organizer location"
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
                    <FormField
                      control={form.control}
                      name="registration_fee"
                      rules={{ required: "Registration fee is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Registration Fee</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Registration fee"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="registration_currency"
                      rules={{ required: "Currency is required" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                <Button type="submit" disabled={isSubmitting === "loading"}>
                  {isSubmitting === "loading"
                    ? "Creating..."
                    : isSubmitting === "error"
                    ? "Error"
                    : "Create Event"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminCheck>
  );
}
