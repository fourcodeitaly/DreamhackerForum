import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { setUserAsAdmin, isUserAdmin } from "@/lib/db/users";

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const supabase = await createServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: "Database connection error" },
        { status: 500 }
      );
    }

    // Get current user session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if current user is admin
    const isAdmin = await isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Set user as admin
    const success = await setUserAsAdmin(userId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "User set as admin successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to set user as admin" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in set-admin route:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
