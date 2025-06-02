"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Check, Edit, Loader2, Save, Upload, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { updateProfile } from "@/lib/db/users/users-update";
import Image from "next/image";
import { User } from "@/lib/db/users/users-get";
import { useTranslation } from "@/hooks/use-translation";
import { Checkbox } from "@/components/ui/checkbox";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  bio: z.string().max(160, {
    message: "Bio must not be longer than 160 characters.",
  }),
  location: z.string().max(30, {
    message: "Location must not be longer than 30 characters.",
  }),
  image: z.instanceof(File).optional(),
  educations: z
    .array(
      z.object({
        school_name: z.string().min(1, "School name is required"),
        degree: z.string().optional(),
        field_of_study: z.string().optional(),
        start_date: z.string().optional(),
        end_date: z.string().optional(),
        is_current: z.boolean().optional(),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileEditFormProps {
  user: User;
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const [open, setOpen] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    user.image_url || null
  );
  const router = useRouter();
  const { t } = useTranslation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      location: user.location || "",
      educations: user.educations || [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    form.setValue("image", undefined);
    setPreviewUrl(null);
  };

  async function onSubmit(data: ProfileFormValues) {
    setSubmitStatus("submitting");
    try {
      await updateProfile(user.id, {
        name: data.name,
        bio: data.bio,
        location: data.location,
        image: data.image,
        educations: data.educations,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      router.refresh();
      setSubmitStatus("success");
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
      setSubmitStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          {t("editProfile")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("editProfile")}</DialogTitle>
          <DialogDescription>{t("editProfileDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>{t("profilePicture")}</FormLabel>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20">
                  {previewUrl ? (
                    <>
                      <Image
                        src={previewUrl}
                        alt="Profile preview"
                        fill
                        className="rounded-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <FormDescription>
                    {t("profilePictureDescription")}
                  </FormDescription>
                </div>
              </div>
            </FormItem>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormDescription>{t("nameDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("bio")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("bioPlaceholder")} {...field} />
                  </FormControl>
                  <FormDescription>{t("bioDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("location")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("locationPlaceholder")} {...field} />
                  </FormControl>
                  <FormDescription>{t("locationDescription")}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{t("education")}</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const currentEducations =
                      form.getValues("educations") || [];
                    form.setValue("educations", [
                      ...currentEducations,
                      {
                        school_name: "",
                        degree: "",
                        field_of_study: "",
                        start_date: "",
                        end_date: "",
                        is_current: false,
                      },
                    ]);
                  }}
                >
                  {t("addEducation")}
                </Button>
              </div>

              {form.watch("educations")?.map((_, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">
                      {t("educationEntry", { number: index + 1 })}
                    </h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const currentEducations =
                          form.getValues("educations") || [];
                        form.setValue(
                          "educations",
                          currentEducations.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`educations.${index}.school_name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("schoolName")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`educations.${index}.degree`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("degree")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`educations.${index}.field_of_study`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("fieldOfStudy")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`educations.${index}.start_date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("startDate")}</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`educations.${index}.end_date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("endDate")}</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              disabled={form.watch(
                                `educations.${index}.is_current`
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`educations.${index}.is_current`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          {t("currentlyStudying")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={submitStatus === "submitting"}>
                {submitStatus === "submitting" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t("save")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
