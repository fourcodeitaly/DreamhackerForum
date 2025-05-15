import { getPostById } from "@/lib/db/posts/post-get";
import PostEditor from "@/components/post/post-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const post = await getPostById(id);

  return <PostEditor post={post} />;
}
