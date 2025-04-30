"use client";

import { useEffect, useState } from "react";
import { MultilingualPostForm } from "@/components/multilingual-post-form";
import { useTranslation } from "@/hooks/use-translation";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminCheck } from "@/components/admin-check";
import { getPostById } from "@/lib/data-utils-supabase";

export default function EditPostPage() {
  const { t } = useTranslation();
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (params.id) {
        try {
          const fetchedPost = await getPostById(params.id as string);
          setPost(fetchedPost);
        } catch (error) {
          console.error("Error fetching post:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

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
