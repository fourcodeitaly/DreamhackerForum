"use client"

import { useLanguage as useLanguageContext } from "@/components/language-provider"

export function useLanguage() {
  return useLanguageContext()
}
