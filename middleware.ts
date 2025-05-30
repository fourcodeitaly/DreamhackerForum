import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Redirect root path to posts page
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/posts?page=1", request.url));
  }

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/admin",
    "/admin/users",
    "/posts/create",
    "/posts/:path*/edit",
  ];

  // Check if the current route is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => {
    if (route.includes(":path*")) {
      // Handle dynamic routes
      const pattern = route.replace(":path*", "[^/]+");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(request.nextUrl.pathname);
    }
    return request.nextUrl.pathname.startsWith(route);
  });

  if (isProtectedRoute) {
    // Check NextAuth.js session
    const token = await getToken({ req: request });

    // If no session, redirect to login
    if (!token) {
      const redirectUrl = new URL("/auth/signin", request.url);
      redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // For admin routes, check if user has admin role
    if (request.nextUrl.pathname.startsWith("/admin")) {
      const isAdmin = token.role === "admin";
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/auth (NextAuth.js API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)",
  ],
};
