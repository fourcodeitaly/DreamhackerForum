"use client"

import { PostForm } from "@/components/post-form"
import { useTranslation } from "@/hooks/use-translation"

export default function CreatePostPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("createPost")}</h1>
      <PostForm />
    </div>
  )
}
