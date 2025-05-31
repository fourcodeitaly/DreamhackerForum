import { translations } from "./translations";
import { cookies } from "next/headers";

type Locale = keyof typeof translations;

export function getTranslation(locale: Locale = "vi") {
  const t = (key: string, params?: Record<string, string | number>) => {
    const translation =
      translations[locale]?.[
        key as keyof (typeof translations)[typeof locale]
      ] ||
      translations.en[key as keyof typeof translations.en] ||
      key;

    if (params) {
      return Object.entries(params).reduce((acc, [key, value]) => {
        return acc.replace(`{${key}}`, String(value));
      }, translation);
    }

    return translation;
  };

  return { t, locale };
}

export async function getServerTranslation() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "vi") as Locale;
  return getTranslation(locale);
}

export async function getServerLanguage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value || "vi") as Locale;
  return locale;
}
