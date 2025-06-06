"use client";

import { PostForm } from "@/components/post/post-form";
import { useTranslation } from "@/hooks/use-translation";
import { AdminCheck } from "@/components/admin/admin-check";
import { AuthCheck } from "@/components/admin/auth-check";

export default function CreatePostPage() {
  const { t } = useTranslation();

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("createPost")}</h1>
        <PostForm />
      </div>
    </AuthCheck>
  );
}
