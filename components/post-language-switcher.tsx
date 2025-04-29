"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { useTranslation } from "@/hooks/use-translation"

interface PostLanguageSwitcherProps {
  onLanguageChange?: (language: string) => void
}

export function PostLanguageSwitcher({ onLanguageChange }: PostLanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()

  const handleLanguageChange = (newLanguage: "en" | "zh" | "vi") => {
    setLanguage(newLanguage)
    if (onLanguageChange) {
      onLanguageChange(newLanguage)
    }
  }

  return (
    <div className="flex space-x-2 mb-4">
      <Button variant={language === "en" ? "default" : "outline"} size="sm" onClick={() => handleLanguageChange("en")}>
        English
      </Button>
      <Button variant={language === "zh" ? "default" : "outline"} size="sm" onClick={() => handleLanguageChange("zh")}>
        中文
      </Button>
      <Button variant={language === "vi" ? "default" : "outline"} size="sm" onClick={() => handleLanguageChange("vi")}>
        Tiếng Việt
      </Button>
    </div>
  )
}
