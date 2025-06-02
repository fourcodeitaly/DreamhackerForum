import { translateText } from "@/services/translation-service";
import { requestErrorHandler } from "@/handler/error-handler";
import { BadRequestError } from "@/handler/error";

export async function POST(request: Request) {
  return requestErrorHandler(async () => {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      throw new BadRequestError();
    }

    const translatedText = await translateText(text, targetLanguage);

    return { translatedText };
  });
}
