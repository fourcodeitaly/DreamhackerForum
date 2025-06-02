import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { openAIGenerateMarkdown } from "@/utils/markdown-generator";
import { requestErrorHandler } from "@/handler/error-handler";
import { UnauthorizedError } from "@/handler/error";
import { BadRequestError } from "@/handler/error";

export async function POST(request: NextRequest) {
  return requestErrorHandler(async () => {
    const { content } = await request.json();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      throw new UnauthorizedError();
    }

    if (!content) {
      throw new BadRequestError();
    }

    const markdown = await openAIGenerateMarkdown(content);
    return { markdown };
  });
}
