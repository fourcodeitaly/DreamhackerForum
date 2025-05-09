"use client";

import { useLanguage as useLanguageContext } from "@/components/providers/language-provider";

export function useLanguage() {
  return useLanguageContext();
}
