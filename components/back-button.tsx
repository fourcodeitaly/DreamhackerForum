"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <Button variant="ghost" size="sm" className="gap-1" onClick={() => router.back()}>
      <ArrowLeft className="h-4 w-4" />
      {t("back")}
    </Button>
  )
}
