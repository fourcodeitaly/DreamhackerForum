import type React from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { isUserAdmin } from "@/lib/db/users"
import { AdminSidebar } from "@/components/admin/sidebar"
import { cookies } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  // Check if user is authenticated and is admin
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    redirect("/login")
  }

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  const isAdmin = await isUserAdmin(session.user.id)
  if (!isAdmin) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
