"use client";

import { useState } from "react";
import { MultilingualPostForm } from "@/components/post/multilingual-post-form";
import { useTranslation } from "@/hooks/use-translation";
import { AdminCheck } from "@/components/admin/admin-check";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Post } from "@/lib/db/posts/posts-modify";

export default function PostEditor({ post }: { post: Post | null }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("postNotFound")}</h1>
        <p>{t("postNotFoundDescription")}</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: t("success"),
          description: t("postDeleted"),
        });
        router.push("/");
      } else {
        toast({
          title: t("error"),
          description: data.error || t("errorDeletingPost"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: t("error"),
        description: t("errorDeletingPost"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminCheck>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t("editPost")}</h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {isDeleting ? (
                <Button variant="destructive" size="sm" disabled>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("deleting")}
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {t("delete")}
                </Button>
              )}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("deletePost")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("deletePostConfirmation")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("deleting")}
                    </>
                  ) : (
                    t("delete")
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <MultilingualPostForm initialData={post} isEditing={true} />
      </div>
    </AdminCheck>
  );
}
