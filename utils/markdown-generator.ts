"use server";

import { OpenAI } from "openai";
import { config } from "@/lib/config";

export const openAIGenerateMarkdown = async ({
  content,
  addEmoji = false,
}: {
  content: string;
  addEmoji?: boolean;
}): Promise<string> => {
  const openai = new OpenAI({
    apiKey: config.openaiApiKey,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant that generates markdown for a post based on the post content.`,
      },
      {
        role: "user",
        content: `Generate markdown for the post content: ${content}. 
        ${addEmoji ? "Add emoji to the post content." : ""}
        return as json format: {markdown: string}`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const markdownResponse = JSON.parse(
    response.choices[0].message.content || "{}"
  ) as {
    markdown: string;
  };

  if (!markdownResponse.markdown) {
    throw new Error("Failed to generate markdown");
  }

  return markdownResponse.markdown;
};
