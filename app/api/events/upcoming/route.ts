import { NextRequest, NextResponse } from "next/server";
import { getUpcomingEvents } from "@/lib/db/events/event-get";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 5;

    const events = await getUpcomingEvents(limit);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return NextResponse.json(
      { error: "Failed to fetch upcoming events" },
      { status: 500 }
    );
  }
}
