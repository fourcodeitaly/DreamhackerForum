import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AdminUsersList } from "@/components/admin/users-list";
import { Skeleton } from "@/components/ui/skeleton";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  // Check if user is authenticated and is admin
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const user = session.user;
  if (!user) {
    redirect("/login");
  }

  const isAdmin = user.role === "admin";
  if (!isAdmin) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <AdminUsersList />
      </Suspense>
    </div>
  );
}
