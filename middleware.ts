import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client configured to use cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getUser();

  // Redirect root path to posts page
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/posts", request.url));
  }

  // Admin-only routes
  const adminRoutes = [
    "/admin",
    "/admin/users",
    "/create-post",
    "/posts/:path*/edit",
  ];

  // Check if the current route is an admin route
  const isAdminRoute = adminRoutes.some((route) => {
    if (route.includes(":path*")) {
      // Handle dynamic routes
      const pattern = route.replace(":path*", "[^/]+");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(request.nextUrl.pathname);
    }
    return route === request.nextUrl.pathname;
  });

  if (isAdminRoute) {
    // Get the session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If no session and trying to access admin route, redirect to login
    if (!user) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
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
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
