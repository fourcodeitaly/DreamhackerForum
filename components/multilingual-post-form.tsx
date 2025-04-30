"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTranslation } from "@/hooks/use-translation"
import { useRouter } from "next/navigation"
import { Loader2, Upload, X, Languages, LinkIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownEditor } from "@/components/markdown-editor" // Use Markdown Editor
import { translateText } from "@/lib/translation-service"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { createPostAction, updatePostAction } from "@/app/actions"
import type { Post } from "@/lib/db/posts"

interface MultilingualPostFormProps {
  initialData?: Post
  isEditing?: boolean
}

export function MultilingualPostForm({ initialData, isEditing = false }: MultilingualPostFormProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  // Initialize with empty content or existing content if editing
  const [title, setTitle] = useState({
    en: initialData?.title?.en || "",
    zh: initialData?.title?.zh || "",
    vi: initialData?.title?.vi || "",
  })

  const [content, setContent] = useState({
    en: initialData?.content?.en || "",
    zh: initialData?.content?.zh || "",
    vi: initialData?.content?.vi || "",
  })

  const [category, setCategory] = useState(initialData?.category_id || "")
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [currentTag, setCurrentTag] = useState("")
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
  const [originalLink, setOriginalLink] = useState<string>(initialData?.original_link || "") // Added original link
  const [isLoading, setIsLoading] = useState(false)
  const [activeLanguage, setActiveLanguage] = useState<"en" | "zh" | "vi">("en")
  const [isTranslating, setIsTranslating] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault()
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()])
      }
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleTitleChange = (lang: "en" | "zh" | "vi", value: string) => {
    setTitle({ ...title, [lang]: value })
  }

  const handleContentChange = (lang: "en" | "zh" | "vi", value: string) => {
    setContent({ ...content, [lang]: value })
  }

  const handleTranslate = async (sourceLang: "en" | "zh" | "vi", targetLang: "en" | "zh" | "vi") => {
    if (!title[sourceLang] && !content[sourceLang]) {
      toast({
        title: t("translationError"),
        description: t("noContentToTranslate"),
        variant: "destructive",
      })
      return
    }

    setIsTranslating(true)
    try {
      // Translate title
      if (title[sourceLang]) {
        const translatedTitle = await translateText(title[sourceLang], targetLang)
        setTitle((prev) => ({ ...prev, [targetLang]: translatedTitle }))
      }

      // Translate content
      if (content[sourceLang]) {
        const translatedContent = await translateText(content[sourceLang], targetLang)
        setContent((prev) => ({ ...prev, [targetLang]: translatedContent }))
      }

      toast({
        title: t("translationComplete"),
        description: t("contentTranslated"),
      })
    } catch (error) {
      toast({
        title: t("translationError"),
        description: t("errorTranslatingContent"),
        variant: "destructive",
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: t("error"),
        description: t("mustBeLoggedIn"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Validate that at least English content is provided
    if (!title.en || !content.en) {
      toast({
        title: t("validationError"),
        description: t("englishContentRequired"),
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validate URL format if original link is provided
    if (originalLink && !isValidUrl(originalLink)) {
      toast({
        title: t("validationError"),
        description: t("invalidUrlFormat"),
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Generate excerpt from content (strip markdown formatting)
      const excerpt = {
        en: content.en.substring(0, 150).replace(/[#*_~`[\]()]/g, ""),
        zh: content.zh ? content.zh.substring(0, 150).replace(/[#*_~`[\]()]/g, "") : undefined,
        vi: content.vi ? content.vi.substring(0, 150).replace(/[#*_~`[\]()]/g, "") : undefined,
      }

      if (isEditing && initialData) {
        // Update existing post
        const result = await updatePostAction(initialData.id, {
          title,
          content,
          categoryId: category,
          tags,
          imageUrl: imagePreview,
          originalLink: originalLink || undefined, // Include original link
        }).catch((error) => {
          console.error("Error updating post:", error)
          return { success: false, message: "Error updating post" }
        })

        if (result.success) {
          toast({
            title: t("success"),
            description: t("postUpdated"),
          })
          router.push(`/posts/${result.post.id}`)
        } else {
          toast({
            title: t("error"),
            description: result.message || t("errorUpdatingPost"),
            variant: "destructive",
          })
        }
      } else {
        // Create new post
        const result = await createPostAction({
          userId: user.id,
          title,
          content,
          categoryId: category,
          tags,
          imageUrl: imagePreview,
          originalLink: originalLink || undefined, // Include original link
        }).catch((error) => {
          console.error("Error creating post:", error)
          return { success: false, message: "Error creating post" }
        })

        if (result.success) {
          toast({
            title: t("success"),
            description: t("postCreated"),
          })
          router.push(`/posts/${result.post.id}`)
        } else {
          toast({
            title: t("error"),
            description: result.message || t("errorCreatingPost"),
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error)
      toast({
        title: t("error"),
        description: isEditing ? t("errorEditingPost") : t("errorCreatingPost"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Validate URL format
  const isValidUrl = (urlString: string): boolean => {
    try {
      if (!urlString) return true
      new URL(urlString)
      return true
    } catch (e) {
      return false
    }
  }

  // Category groups for the select dropdown
  const categoryGroups = [
    {
      label: t("mbaPrograms"),
      options: [
        { value: "school-information", label: t("schoolInformation") },
        { value: "mba-rankings", label: t("mbaRankings") },
        { value: "application-faq", label: t("applicationFAQ") },
        { value: "application-strategy", label: t("applicationStrategy") },
        { value: "resume", label: t("resume") },
        { value: "recommendation-letter", label: t("recommendationLetter") },
        { value: "essay-writing", label: t("essayWriting") },
        { value: "mba-interviews", label: t("mbaInterviews") },
        { value: "application-summary", label: t("applicationSummary") },
      ],
    },
    {
      label: t("businessSchool"),
      options: [
        { value: "school-introduction", label: t("schoolIntroduction") },
        { value: "major-and-ranking", label: t("majorAndRanking") },
        { value: "business-application-faq", label: t("applicationFAQ") },
        { value: "business-recommendation-letter", label: t("recommendationLetter") },
        { value: "ps-resume", label: t("psResume") },
        { value: "business-interview", label: t("businessInterview") },
        { value: "business-application-summary", label: t("applicationSummary") },
      ],
    },
    {
      label: t("phdPrograms"),
      options: [
        { value: "business-school-intro", label: t("businessSchoolIntro") },
        { value: "phd-ranking", label: t("ranking") },
        { value: "phd-application-faq", label: t("applicationFAQ") },
        { value: "phd-recommendation-letter", label: t("recommendationLetter") },
        { value: "phd-application-summary", label: t("applicationSummary") },
        { value: "phd-study-experience", label: t("phdStudyExperience") },
        { value: "phd-interview", label: t("phdInterview") },
      ],
    },
    {
      label: t("studyAbroad"),
      options: [
        { value: "visa-interview", label: t("visaInterview") },
        { value: "university-interview", label: t("universityInterview") },
        { value: "scholarship-interview", label: t("scholarshipInterview") },
        { value: "language-test", label: t("languageTest") },
        { value: "application-tips", label: t("applicationTips") },
        { value: "cultural-adjustment", label: t("culturalAdjustment") },
      ],
    },
  ]

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
                {activeLanguage === "en" ? "English" : activeLanguage === "zh" ? "中文" : "Tiếng Việt"}
              </div>
            </div>

            <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as "en" | "zh" | "vi")}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="zh">中文</TabsTrigger>
                <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
              </TabsList>

              <div className="mt-2 flex justify-end space-x-2">
                {activeLanguage !== "en" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslate("en", activeLanguage)}
                    disabled={isTranslating}
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("translating")}
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("translateFromEnglish")}
                      </>
                    )}
                  </Button>
                )}
                {activeLanguage !== "zh" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslate("zh", activeLanguage)}
                    disabled={isTranslating}
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("translating")}
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("translateFromChinese")}
                      </>
                    )}
                  </Button>
                )}
                {activeLanguage !== "vi" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslate("vi", activeLanguage)}
                    disabled={isTranslating}
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("translating")}
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("translateFromVietnamese")}
                      </>
                    )}
                  </Button>
                )}
              </div>

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
              <TabsContent value="vi" className="mt-2">
                <Input
                  id="title-vi"
                  value={title.vi}
                  onChange={(e) => handleTitleChange("vi", e.target.value)}
                  placeholder={t("postTitlePlaceholderVi")}
                />
              </TabsContent>
            </Tabs>
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
                {activeLanguage === "en" ? "English" : activeLanguage === "zh" ? "中文" : "Tiếng Việt"}
              </div>
            </div>

            <Tabs value={activeLanguage} onValueChange={(value) => setActiveLanguage(value as "en" | "zh" | "vi")}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="zh">中文</TabsTrigger>
                <TabsTrigger value="vi">Tiếng Việt</TabsTrigger>
              </TabsList>

              <div className="mt-2 flex justify-end space-x-2">
                {activeLanguage !== "en" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslate("en", activeLanguage)}
                    disabled={isTranslating}
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("translating")}
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("translateFromEnglish")}
                      </>
                    )}
                  </Button>
                )}
                {activeLanguage !== "zh" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslate("zh", activeLanguage)}
                    disabled={isTranslating}
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("translating")}
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("translateFromChinese")}
                      </>
                    )}
                  </Button>
                )}
                {activeLanguage !== "vi" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleTranslate("vi", activeLanguage)}
                    disabled={isTranslating}
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("translating")}
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        {t("translateFromVietnamese")}
                      </>
                    )}
                  </Button>
                )}
              </div>

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
              <TabsContent value="vi" className="mt-2">
                <MarkdownEditor
                  value={content.vi}
                  onChange={(value) => handleContentChange("vi", value)}
                  placeholder={t("postContentPlaceholderVi")}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">{t("tags")}</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">{t("removeTag")}</span>
                  </Button>
                </Badge>
              ))}
            </div>
            <Input
              id="tags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder={t("addTagsPlaceholder")}
              onKeyDown={handleAddTag}
            />
            <p className="text-xs text-muted-foreground">{t("pressEnterToAddTag")}</p>
          </div>

          <div className="space-y-2">
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
                <p className="mt-2 text-sm text-muted-foreground">{t("dragAndDropImage")}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  {t("selectImage")}
                </Button>
                <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
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
  )
}
