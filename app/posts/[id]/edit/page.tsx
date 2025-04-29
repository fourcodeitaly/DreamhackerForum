"use client"

import { useEffect, useState } from "react"
import { MultilingualPostForm } from "@/components/multilingual-post-form"
import { useTranslation } from "@/hooks/use-translation"
import { getMockPostById } from "@/lib/mock-data"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

export default function EditPostPage() {
  const { t } = useTranslation()
  const params = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      // In a real app, you would fetch the post from your API
      const fetchedPost = getMockPostById(params.id as string)

      // Transform the post data to match our multilingual structure
      if (fetchedPost) {
        const transformedPost = {
          ...fetchedPost,
          title: {
            en: fetchedPost.title,
            zh: fetchedPost.title ? `[中文] ${fetchedPost.title}` : "",
            vi: fetchedPost.title ? `[Tiếng Việt] ${fetchedPost.title}` : "",
          },
          content: {
            en: fetchedPost.content,
            zh: fetchedPost.content
              ? fetchedPost.content
                  .split("\n")
                  .map((p: string) => `[中文] ${p}`)
                  .join("\n")
              : "",
            vi: fetchedPost.content
              ? fetchedPost.content
                  .split("\n")
                  .map((p: string) => `[Tiếng Việt] ${p}`)
                  .join("\n")
              : "",
          },
        }
        setPost(transformedPost)
      }
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("postNotFound")}</h1>
        <p>{t("postNotFoundDescription")}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("editPost")}</h1>
      <MultilingualPostForm initialData={post} isEditing={true} />
    </div>
  )
}
