"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

type Language = "en" | "vi";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("vi");
  const router = useRouter();
  useEffect(() => {
    // Check if there's a saved language preference in cookie
    const savedLanguage = Cookies.get("NEXT_LOCALE") as Language;
    if (savedLanguage && ["en", "vi"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    // Set both cookie and localStorage for redundancy
    Cookies.set("NEXT_LOCALE", newLanguage, {
      expires: 365, // 1 year
      path: "/",
      sameSite: "lax",
    });
    localStorage.setItem("language", newLanguage);
    router.refresh();
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
