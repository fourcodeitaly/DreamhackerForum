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

  const tagsList = [
    { name: t("usTag"), id: "75d74626-55fe-47be-bc03-7e6531d19249" },
    { name: t("ukTag"), id: "65df2188-2c7a-43e0-affc-bf0d4ac924f5" },
    { name: t("caTag"), id: "e4e9fb41-5a05-470c-925b-f91b1a00d962" },
    { name: t("auTag"), id: "40e5e7f7-fc8c-4e17-9297-02e4c04623f4" },
    { name: t("cnTag"), id: "4b1a14a4-a5a9-46af-968f-2d1d75f470e5" },
    { name: t("vnTag"), id: "4e1e7c2a-5250-4758-b7db-58497c6a3081" },
    { name: t("scholarshipsTag"), id: "c34d416e-1bed-4474-a020-e83032e2b15d" },
  ];

  const [category, setCategory] = useState(initialData?.category_id || "");
  const [tags, setTags] = useState<{ name: string; id: string }[]>(
    initialData?.tags || []
  );

  const [currentTag, setCurrentTag] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null
  );
  const [originalLink, setOriginalLink] = useState<string>(
    initialData?.original_link || ""
  ); // Added original link
  const [isLoading, setIsLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<"en" | "zh" | "vi">(
    "vi"
  );
  const [isTranslatingTitle, setIsTranslatingTitle] = useState(false);
  const [isTranslatingContent, setIsTranslatingContent] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
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

    // Validate that at least English content is provided
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
    if (originalLink && !isValidUrl(originalLink)) {
      toast({
        title: t("validationError"),
        description: t("invalidUrlFormat"),
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

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
          imageUrl: imagePreview,
          originalLink: originalLink || undefined, // Include original link
        }).catch((error) => {
          console.error("Error updating post:", error);
          return { success: false, message: "Error updating post" };
        });

        if (result.success) {
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
          imageUrl: imagePreview || undefined,
          originalLink: originalLink || undefined, // Include original link
        });

        if (result.success && result.post) {
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

  // Validate URL format
  const isValidUrl = (urlString: string): boolean => {
    try {
      if (!urlString) return true;
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Category groups for the select dropdown
  const categoryGroups = [
    {
      label: t("mbaPrograms"),
      options: [
        { value: "mba-school-information", label: t("mbaSchoolInformation") },
        { value: "mba-rankings", label: t("mbaRankings") },
        { value: "mba-application-faq", label: t("mbaApplicationFAQ") },
        {
          value: "mba-application-strategy",
          label: t("mbaApplicationStrategy"),
        },
        { value: "mba-resume", label: t("mbaResume") },
        {
          value: "mba-recommendation-letter",
          label: t("mbaRecommendationLetter"),
        },
        { value: "mba-essay-writing", label: t("mbaEssayWriting") },
        { value: "mba-interviews", label: t("mbaInterviews") },
        { value: "mba-application-summary", label: t("mbaApplicationSummary") },
      ],
    },
    {
      label: t("masterPrograms"),
      options: [
        {
          value: "master-school-introduction",
          label: t("masterSchoolIntroduction"),
        },
        {
          value: "master-major-ranking",
          label: t("masterMajorRanking"),
        },
        {
          value: "master-business-application-faq",
          label: t("masterApplicationFAQ"),
        },
        {
          value: "master-recommendation-letter",
          label: t("masterRecommendationLetter"),
        },
        { value: "master-ps-resume", label: t("masterPsResume") },
        {
          value: "master-business-interview",
          label: t("masterBusinessInterview"),
        },
        {
          value: "master-application-summary",
          label: t("masterApplicationSummary"),
        },
        {
          value: "master-scholarship",
          label: t("masterSCholarship"),
        },
      ],
    },
    {
      label: t("phdPrograms"),
      options: [
        {
          value: "phd-business-school-intro",
          label: t("phdBusinessSchoolIntro"),
        },
        { value: "phd-ranking", label: t("phdRanking") },
        { value: "phd-application-faq", label: t("phdApplicationFAQ") },
        {
          value: "phd-recommendation-letter",
          label: t("phdRecommendationLetter"),
        },
        { value: "phd-application-summary", label: t("phdApplicationSummary") },
        { value: "phd-study-experience", label: t("phdStudyExperience") },
        { value: "phd-interview", label: t("phdInterview") },
        {
          value: "phd-scholarship",
          label: t("phdSCholarship"),
        },
      ],
    },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">{t("category")}</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder={t("selectCategory")} />
              </SelectTrigger>
              <SelectContent>
                {categoryGroups.map((group) => (
                  <SelectGroup key={group.label}>
                    <SelectLabel>{group.label}</SelectLabel>
                    {group.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="tags">{t("tags").split(")")[1]}</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full"
                >
                  <span>{tag.name}</span>
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
            <Select value={currentTag} onValueChange={handleAddTag}>
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
            </Select>
          </div>

          {/* Original Link Field */}
          <div className="space-y-2">
            <Label htmlFor="original-link" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              {t("originalSource") || "Original Source Link"}
            </Label>
            <Input
              id="original-link"
              type="url"
              value={originalLink}
              onChange={(e) => setOriginalLink(e.target.value)}
              placeholder="https://example.com/article"
            />
            <p className="text-xs text-muted-foreground">
              {t("optionalSourceLink") || "Optional source link for reference"}
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

          {/* <div className="space-y-2">
            <Label htmlFor="image">{t("image")}</Label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-64 rounded-md object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">{t("removeImage")}</span>
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("dragAndDropImage")}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                >
                  {t("selectImage")}
                </Button>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </div> */}

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
