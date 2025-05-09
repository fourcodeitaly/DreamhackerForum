import { NextResponse } from "next/server"
import { translateText } from "@/lib/translation-service"

export async function POST(request: Request) {
  try {
    const { text, targetLanguage } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: "Text and target language are required" }, { status: 400 })
    }

    const translatedText = await translateText(text, targetLanguage)

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error("Translation error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}
