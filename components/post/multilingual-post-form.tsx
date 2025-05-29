"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    zh: initialData?.title?.zh || "",
    vi: initialData?.title?.vi || "",
  });

  const [content, setContent] = useState({
    en: initialData?.content?.en || "",
    zh: initialData?.content?.zh || "",
    vi: initialData?.content?.vi || "",
  });

  // const tagsList = [
  //   { name: t("scholarshipsTag"), id: "c34d416e-1bed-4474-a020-e83032e2b15d" },
  //   { name: t("internship"), id: "8dbc5297-53da-482b-b895-0345d5143bbd" },
  //   { name: t("usTag"), id: "75d74626-55fe-47be-bc03-7e6531d19249" },
  //   { name: t("ukTag"), id: "65df2188-2c7a-43e0-affc-bf0d4ac924f5" },
  //   { name: t("caTag"), id: "e4e9fb41-5a05-470c-925b-f91b1a00d962" },
  //   { name: t("auTag"), id: "40e5e7f7-fc8c-4e17-9297-02e4c04623f4" },
  //   { name: t("cnTag"), id: "4b1a14a4-a5a9-46af-968f-2d1d75f470e5" },
  //   { name: t("vnTag"), id: "4e1e7c2a-5250-4758-b7db-58497c6a3081" },
  //   { name: t("sgTag"), id: "83f2e16c-5c5d-459f-ab3d-301efefa78ad" },
  //   { name: t("deTag"), id: "705da86e-4ea8-4d96-a33d-16b8d4d4bf8f" },
  //   { name: t("frTag"), id: "3a3b7c21-9f07-40bb-944b-b72fe89ef8c9" },
  //   { name: t("nlTag"), id: "7b98881d-f4de-40f6-81e0-4ec9e7f4dff4" },
  //   { name: t("esTag"), id: "4c9579a3-8ac8-43bb-8fbb-32280ba0bb91" },
  //   { name: t("hkTag"), id: "379ec624-0d31-4026-aa48-38396f542fe5" },
  //   { name: t("jpTag"), id: "d87db404-09f1-4f92-ada4-16e8baa73856" },
  //   { name: t("seTag"), id: "8c589bbf-0cce-4d26-a28c-d17c8942155e" },
  //   { name: t("chTag"), id: "43428091-acb5-478d-b351-975725896454" },
  //   { name: t("itTag"), id: "4edebb77-56a0-451e-92cb-5c3cda094349" },
  //   { name: t("krTag"), id: "38cce86f-9566-4672-97a8-892cb30242eb" },
  //   { name: t("dkTag"), id: "1160cfeb-35fd-4ad0-b03e-5b35a6d32d22" },
  //   { name: t("noTag"), id: "9a5bb1e8-c7f8-49ee-af34-fbdf53d5b4f2" },
  //   { name: t("fiTag"), id: "442e3a3f-75db-4a0e-8ec2-6a161c00e2b9" },
  //   { name: t("huTag"), id: "ef5fe957-7903-4629-8f2b-a7035d4dc8b7" },
  //   { name: t("ieTag"), id: "f38ab0c6-88ee-4587-bfe7-2eee9585b1ca" },
  //   { name: t("inTag"), id: "6e1f2209-e06b-40f4-8bf5-ea6ebeabdfb1" },
  //   { name: t("ptTag"), id: "d14583f2-da16-4c10-9b26-08107149a674" },
  //   { name: t("twTag"), id: "9816ef27-5053-4f59-9270-773a3d0a0a86" },
  // ];

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
  const [activeLanguage, setActiveLanguage] = useState<"en" | "zh" | "vi">(
    "vi"
  );
  const [isTranslatingTitle, setIsTranslatingTitle] = useState(false);
  const [isTranslatingContent, setIsTranslatingContent] = useState(false);
  const [tagsList, setTagsList] = useState<{ name: string; id: string }[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getTags();
      console.log(tags);
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

  const handleTitleChange = (lang: "en" | "zh" | "vi", value: string) => {
    setTitle({ ...title, [lang]: value });
  };

  const handleContentChange = (lang: "en" | "zh" | "vi", value: string) => {
    setContent({ ...content, [lang]: value });
  };

  const handleTranslateTitle = async (
    sourceLang: "en" | "zh" | "vi",
    targetLang: "en" | "zh" | "vi"
  ) => {
    if (!title[sourceLang]) {
      toast({
        title: t("translationError"),
        description: t("noTitleToTranslate"),
        variant: "destructive",
      });
      return;
    }

    setIsTranslatingTitle(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: title[sourceLang],
          targetLanguage: targetLang,
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const { translatedText } = await response.json();
      setTitle((prev) => ({
        ...prev,
        [targetLang]: translatedText.replace(/^"|"$/g, ""),
      }));

      toast({
        title: t("translationComplete"),
        description: t("titleTranslated"),
      });
    } catch (error) {
      toast({
        title: t("translationError"),
        description: t("errorTranslatingTitle"),
        variant: "destructive",
      });
    } finally {
      setIsTranslatingTitle(false);
    }
  };

  const handleTranslateContent = async (
    sourceLang: "en" | "zh" | "vi",
    targetLang: "en" | "zh" | "vi"
  ) => {
    if (!content[sourceLang]) {
      toast({
        title: t("translationError"),
        description: t("noContentToTranslate"),
        variant: "destructive",
      });
      return;
    }

    setIsTranslatingContent(true);
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: content[sourceLang],
          targetLanguage: targetLang,
        }),
      });

      if (!response.ok) {
        throw new Error("Translation failed");
      }

      const { translatedText } = await response.json();
      setContent((prev) => ({
        ...prev,
        [targetLang]: translatedText.replace(/^"|"$/g, ""),
      }));

      toast({
        title: t("translationComplete"),
        description: t("contentTranslated"),
      });
    } catch (error) {
      toast({
        title: t("translationError"),
        description: t("errorTranslatingContent"),
        variant: "destructive",
      });
    } finally {
      setIsTranslatingContent(false);
    }
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
        zh: content.zh
          ? content.zh.substring(0, 150).replace(/[#*_~`[\]()]/g, "")
          : undefined,
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
    {
      name: t("internship"),
      options: [{ id: "internship", name: t("allInternship") }],
    },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <div className="space-y-2">
            <Label htmlFor="category">{t("category")}</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categoryGroups.map((group) => (
                  <SelectGroup key={group.name}>
                    <SelectLabel>{group.name}</SelectLabel>
                    {group.options.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title">{t("title")}</Label>
              <div className="text-sm text-muted-foreground">
                {activeLanguage === "en"
                  ? "English"
                  : activeLanguage === "zh"
                  ? "中文"
                  : "Tiếng Việt"}
              </div>
            </div>

            <Tabs
              value={activeLanguage}
              onValueChange={(value) =>
                setActiveLanguage(value as "en" | "zh" | "vi")
              }
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="zh">中文</TabsTrigger>
              </TabsList>

              <div className="mt-2 flex justify-end space-x-2">
                {activeLanguage !== "en" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslateTitle("en", activeLanguage)}
                    disabled={isTranslatingTitle}
                  >
                    {isTranslatingTitle ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("translating")}
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("translateTitleFromEnglish")}
                      </>
                    )}
                  </Button>
                )}
                {activeLanguage !== "zh" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslateTitle("zh", activeLanguage)}
                    disabled={isTranslatingTitle}
                  >
                    {isTranslatingTitle ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("translating")}
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("translateTitleFromChinese")}
                      </>
                    )}
                  </Button>
                )}
                {activeLanguage !== "vi" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslateTitle("vi", activeLanguage)}
                    disabled={isTranslatingTitle}
                  >
                    {isTranslatingTitle ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("translating")}
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("translateTitleFromVietnamese")}
                      </>
                    )}
                  </Button>
                )}
              </div>
              <TabsContent value="vi" className="mt-2">
                <Input
                  id="title-vi"
                  value={title.vi}
                  onChange={(e) => handleTitleChange("vi", e.target.value)}
                  placeholder={t("postTitlePlaceholderVi")}
                />
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
              <TabsContent value="zh" className="mt-2">
                <Input
                  id="title-zh"
                  value={title.zh}
                  onChange={(e) => handleTitleChange("zh", e.target.value)}
                  placeholder={t("postTitlePlaceholderZh")}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">{t("category")}</Label>
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
              <Label htmlFor="tags">{t("tags").split(")")[1]}</Label>
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

            {/* <Select value={currentTag} onValueChange={handleAddTag}>
              <SelectTrigger>
                <SelectValue placeholder={t("addTagsPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("tags").split(")")[1]}</SelectLabel>
                  {tagsList.map((tag) => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name.split(")")[1]}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select> */}
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
              <Label htmlFor="content">{t("content")}</Label>
              <div className="text-sm text-muted-foreground">
                {activeLanguage === "en"
                  ? "English"
                  : activeLanguage === "zh"
                  ? "中文"
                  : "Tiếng Việt"}
              </div>
            </div>

            <Tabs
              value={activeLanguage}
              onValueChange={(value) =>
                setActiveLanguage(value as "en" | "zh" | "vi")
              }
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="zh">中文</TabsTrigger>
              </TabsList>

              <div className="mt-2 flex justify-end space-x-2">
                {activeLanguage !== "en" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslateContent("en", activeLanguage)}
                    disabled={isTranslatingContent}
                  >
                    {isTranslatingContent ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("translating")}
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("translateContentFromEnglish")}
                      </>
                    )}
                  </Button>
                )}
                {activeLanguage !== "zh" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslateContent("zh", activeLanguage)}
                    disabled={isTranslatingContent}
                  >
                    {isTranslatingContent ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("translating")}
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("translateContentFromChinese")}
                      </>
                    )}
                  </Button>
                )}
                {activeLanguage !== "vi" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslateContent("vi", activeLanguage)}
                    disabled={isTranslatingContent}
                  >
                    {isTranslatingContent ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("translating")}
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("translateContentFromVietnamese")}
                      </>
                    )}
                  </Button>
                )}
              </div>
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
              <TabsContent value="zh" className="mt-2">
                <MarkdownEditor
                  value={content.zh}
                  onChange={(value) => handleContentChange("zh", value)}
                  placeholder={t("postContentPlaceholderZh")}
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
