"use client";

import { MultilingualPostForm } from "@/components/multilingual-post-form";
import { useTranslation } from "@/hooks/use-translation";
import { AdminCheck } from "@/components/admin-check";
import { Post } from "@/lib/db/posts/posts-modify";

export default function PostEditor({ post }: { post: Post | null }) {
  const { t } = useTranslation();

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("postNotFound")}</h1>
        <p>{t("postNotFoundDescription")}</p>
      </div>
    );
  }

  return (
    <AdminCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("editPost")}</h1>
        <MultilingualPostForm initialData={post} isEditing={true} />
      </div>
    </AdminCheck>
  );
}
