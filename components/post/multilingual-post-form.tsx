"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X, Languages, LinkIcon, Badge } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MarkdownEditor } from "@/components/markdown-editor"; // Use Markdown Editor
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { createPostAction, updatePostAction } from "@/app/actions";
import type { Post } from "@/lib/db/posts/posts-modify";
import { PresetSelector } from "../ui/present-selector";
import { getTags } from "@/lib/db/tags/tags-get";

interface MultilingualPostFormProps {
  initialData?: Post;
  isEditing?: boolean;
}

export function MultilingualPostForm({
  initialData,
  isEditing = false,
}: MultilingualPostFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize with empty content or existing content if editing
  const [title, setTitle] = useState({
    en: initialData?.title?.en || "",
    vi: initialData?.title?.vi || "",
  });

  const [content, setContent] = useState({
    en: initialData?.content?.en || "",
    vi: initialData?.content?.vi || "",
  });

  const [category, setCategory] = useState(initialData?.category_id || "");
  const [tags, setTags] = useState<{ name: string; id: string }[]>(
    initialData?.tags || []
  );

  const [currentTag, setCurrentTag] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    initialData?.images?.map((img) => img.image_url) || []
  );
  const [existingImages, setExistingImages] = useState<
    { id: string; image_url: string }[]
  >(initialData?.images || []);
  const [eventId, setEventId] = useState<string>(initialData?.event?.id || "");
  const [isLoading, setIsLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<"en" | "vi">("vi");
  const [tagsList, setTagsList] = useState<{ name: string; id: string }[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch("/api/tags");

      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }

      const tags = (await response.json()) as { name: string; id: string }[];
      setTagsList(tags);
    };
    fetchTags();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Create temporary preview URLs
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = async (index: number) => {
    // Check if it's an existing image
    if (index < existingImages.length) {
      const imageToDelete = existingImages[index];
      try {
        const response = await fetch(
          `/api/posts/${initialData?.id}/images/${imageToDelete.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete image");
        }

        // Remove from existing images
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
        // Remove from previews
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      } catch (error) {
        console.error("Error deleting image:", error);
        toast({
          title: t("error"),
          description: t("errorDeletingImage"),
          variant: "destructive",
        });
      }
    } else {
      // It's a new image
      const newIndex = index - existingImages.length;
      setImagePreviews((prev) => prev.filter((_, i) => i !== index));
      setImages((prev) => prev.filter((_, i) => i !== newIndex));
    }
  };

  const handleAddTag = (value: string) => {
    if (value && !tags.some((tag) => tag.id === value)) {
      setTags([
        ...tags,
        {
          name: tagsList.find((tag) => tag.id === value)?.name || "",
          id: value,
        },
      ]);
    }
    setCurrentTag("");
  };

  const handleRemoveTag = (tagToRemove: { name: string; id: string }) => {
    setTags(tags.filter((tag) => tag.id !== tagToRemove.id));
  };

  const handleTitleChange = (lang: "en" | "vi", value: string) => {
    setTitle({ ...title, [lang]: value });
  };

  const handleContentChange = (lang: "en" | "vi", value: string) => {
    setContent({ ...content, [lang]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: t("error"),
        description: t("mustBeLoggedIn"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Validate that at least Vietnamese content is provided
    if (!title.vi || !content.vi) {
      toast({
        title: t("validationError"),
        description: t("vietnameseContentRequired"),
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate URL format if original link is provided

    try {
      // Generate excerpt from content (strip markdown formatting)
      const excerpt = {
        en: content.en.substring(0, 150).replace(/[#*_~`[\]()]/g, ""),
        vi: content.vi
          ? content.vi.substring(0, 150).replace(/[#*_~`[\]()]/g, "")
          : undefined,
      };

      if (isEditing && initialData) {
        // Update existing post
        const result = await updatePostAction(initialData.id, {
          title,
          content,
          categoryId: category,
          tags: tags.map((tag) => tag.id),
          eventId: eventId || undefined,
        }).catch((error) => {
          console.error("Error updating post:", error);
          return { success: false, message: "Error updating post" };
        });

        if (result.success) {
          // If there are new images, upload them
          if (images.length > 0) {
            const formData = new FormData();
            images.forEach((file) => {
              formData.append("files", file);
            });
            formData.append("postId", initialData.id);

            const uploadResponse = await fetch("/api/uploads", {
              method: "POST",
              body: formData,
            });

            if (!uploadResponse.ok) {
              throw new Error("Failed to upload images");
            }
          }

          toast({
            title: t("success"),
            description: t("postUpdated"),
          });
          router.push(`/posts/${initialData.id}`);
        } else {
          toast({
            title: t("error"),
            description: result.message || t("errorUpdatingPost"),
            variant: "destructive",
          });
        }
      } else {
        // Create new post
        const result = await createPostAction({
          userId: user.id,
          title,
          content,
          categoryId: category,
          tags: tags.map((tag) => tag.id),
          eventId: eventId || undefined,
        });

        if (result.success && result.post) {
          // If there are images, upload them
          if (images.length > 0) {
            const formData = new FormData();
            images.forEach((file) => {
              formData.append("files", file);
            });
            formData.append("postId", result.post.id);

            const uploadResponse = await fetch("/api/uploads", {
              method: "POST",
              body: formData,
            });

            if (!uploadResponse.ok) {
              throw new Error("Failed to upload images");
            }
          }

          toast({
            title: t("success"),
            description: t("postCreated"),
          });
          router.push(`/posts/${result.post.id}`);
        } else {
          toast({
            title: t("error"),
            description: result.message || t("errorCreatingPost"),
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      toast({
        title: t("error"),
        description: isEditing ? t("errorEditingPost") : t("errorCreatingPost"),
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Category groups for the select dropdown
  const categoryGroups = [
    {
      name: t("internship"),
      options: [{ id: "internship", name: t("internship") }],
    },
    {
      name: t("undergraduate"),
      options: [{ id: "undergraduate", name: t("undergraduate") }],
    },
    {
      name: t("mbaPrograms"),
      options: [
        { id: "mba-school-information", name: t("mbaSchoolInformation") },
        { id: "mba-rankings", name: t("mbaRankings") },
        { id: "mba-application-faq", name: t("mbaApplicationFAQ") },
        {
          id: "mba-application-strategy",
          name: t("mbaApplicationStrategy"),
        },
        { id: "mba-resume", name: t("mbaResume") },
        {
          id: "mba-recommendation-letter",
          name: t("mbaRecommendationLetter"),
        },
        { id: "mba-essay-writing", name: t("mbaEssayWriting") },
        { id: "mba-interviews", name: t("mbaInterviews") },
        { id: "mba-application-summary", name: t("mbaApplicationSummary") },
      ],
    },
    {
      name: t("masterPrograms"),
      options: [
        {
          id: "master-school-introduction",
          name: t("masterSchoolIntroduction"),
        },
        {
          id: "master-major-ranking",
          name: t("masterMajorRanking"),
        },
        {
          id: "master-business-application-faq",
          name: t("masterApplicationFAQ"),
        },
        {
          id: "master-recommendation-letter",
          name: t("masterRecommendationLetter"),
        },
        { id: "master-ps-resume", name: t("masterPsResume") },
        {
          id: "master-business-interview",
          name: t("masterBusinessInterview"),
        },
        {
          id: "master-application-summary",
          name: t("masterApplicationSummary"),
        },
        {
          id: "master-scholarship",
          name: t("masterScholarship"),
        },
      ],
    },
    {
      name: t("phdPrograms"),
      options: [
        {
          id: "phd-business-school-intro",
          name: t("phdBusinessSchoolIntro"),
        },
        { id: "phd-ranking", name: t("phdRanking") },
        { id: "phd-application-faq", name: t("phdApplicationFAQ") },
        {
          id: "phd-recommendation-letter",
          name: t("phdRecommendationLetter"),
        },
        { id: "phd-application-summary", name: t("phdApplicationSummary") },
        { id: "phd-study-experience", name: t("phdStudyExperience") },
        { id: "phd-interview", name: t("phdInterview") },
        {
          id: "phd-scholarship",
          name: t("phdScholarship"),
        },
      ],
    },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="title"
                className="text-primary border-2 p-2 rounded-full"
              >
                {t("title")}
              </Label>
              <div className="text-sm text-muted-foreground">
                {activeLanguage === "en" ? "English" : "Tiếng Việt"}
              </div>
            </div>

            <Tabs
              value={activeLanguage}
              onValueChange={(value) => setActiveLanguage(value as "en" | "vi")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>

              <TabsContent value="vi" className="mt-2">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  <Input
                    id="title-vi"
                    value={title.vi}
                    onChange={(e) => handleTitleChange("vi", e.target.value)}
                    placeholder={t("postTitlePlaceholderVi")}
                    className="focus-visible:ring-1 focus-visible:ring-offset-0 col-span-1"
                  />
                </div>
              </TabsContent>
              <TabsContent value="en" className="mt-2">
                <Input
                  id="title-en"
                  value={title.en}
                  onChange={(e) => handleTitleChange("en", e.target.value)}
                  required={activeLanguage === "en"}
                  placeholder={t("postTitlePlaceholderEn")}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
            <div className="flex flex-col gap-2">
              <Label htmlFor="category" className="text-primary">
                {t("category")}
              </Label>
              <PresetSelector
                onSelect={(preset) => {
                  setCategory(preset.id);
                }}
                defaultValue={{
                  id: category,
                  name:
                    categoryGroups
                      .find((group) =>
                        group.options.some((option) => option.id === category)
                      )
                      ?.options.find((option) => option.id === category)
                      ?.name || "",
                }}
                presets={categoryGroups.flatMap((group) =>
                  group.options.map((option) => ({
                    id: option.id,
                    name: option.name,
                  }))
                )}
              />
              {/* <PresetSelector presets={tagsList} /> */}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags" className="text-primary ">
                {t("tags").split(")")[1]}
                <p className="text-xs text-muted-foreground">
                  {t("tagsDescription")}
                </p>
              </Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full"
                  >
                    <span>
                      {tag.name.includes(")")
                        ? tag.name.split(")")[1]
                        : tag.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <PresetSelector
                onSelect={(preset) => {
                  handleAddTag(preset.id);
                }}
                presets={tagsList.map((tag) => ({
                  id: tag.id,
                  name: tag.name,
                }))}
              />
            </div>
          </div>

          {/* Original Link Field */}
          <div className="space-y-2">
            <Label htmlFor="original-link" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              {t("events").split(")")[1]}
            </Label>
            <Input
              id="original-link"
              type="text"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder={t("optionalEventId")}
            />
            <p className="text-xs text-muted-foreground">
              {t("optionalEventId") || "Optional event ID for reference"}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content" className="text-primary">
                {t("content")}
              </Label>
              <div className="text-sm text-muted-foreground">
                {activeLanguage === "en" ? "English" : "Tiếng Việt"}
              </div>
            </div>

            <Tabs
              value={activeLanguage}
              onValueChange={(value) => setActiveLanguage(value as "en" | "vi")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
              </TabsList>

              <TabsContent value="vi" className="mt-2">
                <MarkdownEditor
                  value={content.vi}
                  onChange={(value) => handleContentChange("vi", value)}
                  placeholder={t("postContentPlaceholderVi")}
                />
              </TabsContent>
              <TabsContent value="en" className="mt-2">
                <MarkdownEditor
                  value={content.en}
                  onChange={(value) => handleContentChange("en", value)}
                  placeholder={t("postContentPlaceholderEn")}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">{t("images")}</Label>
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
                    <span className="sr-only">{t("removeImage")}</span>
                  </Button>
                </div>
              ))}
              <div className="border-2 border-dashed rounded-md p-4 text-center aspect-square flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("dragAndDropImages")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    document.getElementById("images-upload")?.click()
                  }
                >
                  {t("selectImages")}
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

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? t("updating") : t("publishing")}
                </>
              ) : isEditing ? (
                t("updatePost")
              ) : (
                t("publishPost")
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
