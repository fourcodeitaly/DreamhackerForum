"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export function AuthStatus() {
  const { t } = useTranslation()
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth()

  // Show loading state while authentication state is being determined
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm text-muted-foreground">{t("loading")}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      {isAuthenticated && user ? (
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
              {t("admin")}
            </Badge>
          )}
          <UserNav user={user} />
        </div>
      ) : (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">{t("login")}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">{t("register")}</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
