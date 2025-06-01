import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { openAIGenerateMarkdown } from "@/utils/markdown-generator";

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const markdown = await openAIGenerateMarkdown(content);
    return NextResponse.json({ markdown });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate markdown" },
      { status: 500 }
    );
  }
}
