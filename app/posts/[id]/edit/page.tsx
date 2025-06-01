import { getPostById } from "@/lib/db/posts/post-get";
import PostEditor from "@/components/post/post-editor";
import { OwnerCheck } from "@/components/admin/owner-check";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return notFound();
  }

  return (
    <OwnerCheck userId={post?.user_id}>
      <PostEditor post={post} />
    </OwnerCheck>
  );
}
