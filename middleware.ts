import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Admin-only routes
  const adminRoutes = ["/create-post", "/posts/[id]/edit"]

  // Check if the current route is an admin route
  const isAdminRoute = adminRoutes.some((route) => {
    if (route.includes("[id]")) {
      // Handle dynamic routes
      const pattern = route.replace("[id]", "[^/]+")
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(request.nextUrl.pathname)
    }
    return route === request.nextUrl.pathname
  })

  // If it's an admin route and the user is not authenticated, redirect to login
  if (isAdminRoute && !session) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // For admin routes, we need to check if the user is an admin
  // This would typically be done by checking a role in the database
  // For now, we'll just continue and handle the check in the component

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/create-post", "/posts/:path*/edit"],
}
