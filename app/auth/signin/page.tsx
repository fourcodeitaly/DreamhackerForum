"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">{t("login")}</h1>
        <LoginForm />
        <p className="mt-4 text-center">
          {t("dontHaveAccount")}{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
