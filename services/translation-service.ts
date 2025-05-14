import { Groq } from "groq-sdk";
import { config } from "../lib/config";

// Initialize OpenAI client with Groq API configuration
let client: Groq;

export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  if (!text) return "";

  if (config.groqApiKey) {
    client = new Groq({
      apiKey: config.groqApiKey,
    });
  }

  if (!client) {
    console.error("No API key found");
    throw new Error("No API key found");
  }

  try {
    // Map target language codes to full names for the prompt
    const languageMap: { [key: string]: string } = {
      zh: "Chinese",
      vi: "Vietnamese",
      en: "English",
    };

    const targetLanguageName = languageMap[targetLanguage] || targetLanguage;

    // Create a prompt for translation
    const prompt = `Translate the following text to ${targetLanguageName}: "${text}"`;

    // Call Groq API
    const completion = await client.chat.completions.create({
      model: "llama3-70b-8192", // Use the available Groq model (e.g., grok-beta)
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator. Provide accurate and natural translations. Just return the translation, no other text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000, // Adjust based on expected response length
      temperature: 0.7, // Adjust for creativity vs. accuracy
    });

    // Extract the translated text
    const translatedText = completion.choices[0]?.message?.content?.trim();
    if (!translatedText) {
      throw new Error("No translation returned from Groq API");
    }

    return translatedText;
  } catch (error) {
    console.error("Error translating text with Groq API:", error);
    throw new Error(`Translation failed: ${error}`);
  }
}
