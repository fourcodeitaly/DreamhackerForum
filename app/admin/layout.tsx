import type React from "react";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated and is admin
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const user = session.user;

  const isAdmin = user.role === "admin";
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen container mx-auto px-4 py-12">
      <div className="sticky top-20 h-screen">
        <AdminSidebar />
      </div>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
