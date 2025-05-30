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
      const result = await updateProfile(user.id, {
        name: data.name,
        // bio: data.bio,
        // location: data.location,
        image: data.image,
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      router.refresh();
      setSubmitStatus("success");
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
      <DialogContent className="sm:max-w-[425px]">
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
            {/* <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("bio")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("bioPlaceholder")}
                      className="resize-none"
                      {...field}
                    />
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
            /> */}
            <DialogFooter>
              <Button
                type="submit"
                disabled={submitStatus === "submitting"}
                className={`${
                  submitStatus === "success"
                    ? "bg-green-700"
                    : submitStatus === "error"
                    ? "bg-red-700"
                    : ""
                }`}
              >
                {submitStatus === "submitting" ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : submitStatus === "success" ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    {t("saved")}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t("saveChanges")}
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
