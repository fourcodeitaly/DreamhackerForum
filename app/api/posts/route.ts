import { requestErrorHandler } from "@/handler/error-handler";
import { getPostsByTags } from "@/lib/db/posts/post-get";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return requestErrorHandler(async () => {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 10;
    const tagIds =
      searchParams.get("tagIds") || "c34d416e-1bed-4474-a020-e83032e2b15d";

    const posts = await getPostsByTags(
      tagIds.split(","),
      Number(page),
      Number(limit)
    );
    return posts;
  });
}
