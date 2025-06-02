import { requestErrorHandler } from "@/handler/error-handler";
import { getTags } from "@/lib/db/tags/tags-get";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return requestErrorHandler(async () => {
    const tags = await getTags();
    return tags;
  });
}
