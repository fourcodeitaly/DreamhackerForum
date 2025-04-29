"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { useTranslation } from "@/hooks/use-translation"

interface PostLanguageSwitcherProps {
  onLanguageChange?: (language: string) => void
  currentLanguage?: string
}

export function PostLanguageSwitcher({ onLanguageChange, currentLanguage }: PostLanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()

  // Use provided currentLanguage or fall back to the global language setting
  const activeLang = currentLanguage || language

  const handleLanguageChange = (newLanguage: "en" | "zh" | "vi") => {
    setLanguage(newLanguage)
    if (onLanguageChange) {
      onLanguageChange(newLanguage)
    }
  }

  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={activeLang === "en" ? "default" : "outline"}
        size="sm"
        onClick={() => handleLanguageChange("en")}
      >
        English
      </Button>
      <Button
        variant={activeLang === "zh" ? "default" : "outline"}
        size="sm"
        onClick={() => handleLanguageChange("zh")}
      >
        中文
      </Button>
      <Button
        variant={activeLang === "vi" ? "default" : "outline"}
        size="sm"
        onClick={() => handleLanguageChange("vi")}
      >
        Tiếng Việt
      </Button>
    </div>
  )
}
