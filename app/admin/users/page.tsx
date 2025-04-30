import { Suspense } from "react"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { isUserAdmin } from "@/lib/db/users"
import { AdminUsersList } from "@/components/admin/users-list"
import { Skeleton } from "@/components/ui/skeleton"

export default async function AdminUsersPage() {
  // Check if user is authenticated and is admin
  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    redirect("/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const isAdmin = await isUserAdmin(user.id)
  if (!isAdmin) {
    redirect("/")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <AdminUsersList />
      </Suspense>
    </div>
  )
}
