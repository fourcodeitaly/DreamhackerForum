import { getUserPosts } from "@/lib/db/posts/post-get";
import { requestErrorHandler } from "@/handler/error-handler";
import { InternalServerError } from "@/handler/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return requestErrorHandler(async () => {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");

    const posts = await getUserPosts(id, page, limit);

    return { posts: posts.posts };
  });
}
