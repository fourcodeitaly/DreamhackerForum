"use client";

import { RegisterForm } from "@/components/auth/register-form";
import { useTranslation } from "@/hooks/use-translation";
import Link from "next/link";

export default function RegisterPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">{t("register")}</h1>
        <RegisterForm />
        <p className="mt-4 text-center">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
