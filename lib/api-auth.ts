import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "./supabase/server";

export async function getAuthenticatedUser(req: NextRequest) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { user: null, error: "Database connection failed" };
  }

  try {
    // Get session from cookie
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, error: "Not authenticated" };
    }

    // Get user data from database
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !userData) {
      console.error("User fetch error:", error);
      return { user: null, error: "User not found" };
    }

    return { user, error: null };
  } catch (error) {
    console.error("Authentication error:", error);
    return { user: null, error: "Authentication error" };
  }
}

export function unauthorizedResponse(message = "Authentication required") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbiddenResponse(message = "Access denied") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export async function requireAuth(req: NextRequest) {
  const { user, error } = await getAuthenticatedUser(req);

  if (!user) {
    return {
      authorized: false,
      user: null,
      response: unauthorizedResponse(error),
    };
  }

  return { authorized: true, user, response: null };
}

export async function requireAdmin(req: NextRequest) {
  const { user, error } = await getAuthenticatedUser(req);

  if (!user) {
    return {
      authorized: false,
      user: null,
      response: unauthorizedResponse(error),
    };
  }

  if (user.role !== "admin") {
    return {
      authorized: false,
      user,
      response: forbiddenResponse("Admin access required"),
    };
  }

  return { authorized: true, user, response: null };
}
