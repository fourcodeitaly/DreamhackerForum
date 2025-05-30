import { NextResponse } from "next/server";
import { markAllNotificationsAsRead } from "@/lib/db/notification";
import { getServerSession } from "next-auth";

// POST /api/notifications/read-all - Mark all notifications as read
export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const count = await markAllNotificationsAsRead(user.id);

    return NextResponse.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
