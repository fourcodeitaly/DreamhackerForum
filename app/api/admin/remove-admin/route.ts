import { type NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { removeAdminRole, isUserAdmin } from "@/lib/db/users-get";

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
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if current user is admin
    const isAdmin = await isUserAdmin(user.id);
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

    // Don't allow removing your own admin role
    if (userId === user.id) {
      return NextResponse.json(
        { success: false, message: "Cannot remove your own admin role" },
        { status: 400 }
      );
    }

    // Remove admin role
    const success = await removeAdminRole(userId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Admin role removed successfully",
      });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to remove admin role" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in remove-admin route:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
