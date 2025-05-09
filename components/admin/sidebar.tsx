"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Tag,
  Settings,
  Home,
  Shield,
} from "lucide-react";

const adminRoutes = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Posts",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-background border-r border-border min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <nav className="space-y-1">
        {adminRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === route.href
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-accent/50"
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.name}
          </Link>
        ))}

        <div className="pt-4 mt-4 border-t border-border">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent/50 transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </nav>
    </div>
  );
}
