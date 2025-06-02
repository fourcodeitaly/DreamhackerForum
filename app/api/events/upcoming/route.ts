import { NextRequest, NextResponse } from "next/server";
import { getUpcomingEvents } from "@/lib/db/events/event-get";
import { requestErrorHandler } from "@/handler/error-handler";

export async function GET(request: NextRequest) {
  return requestErrorHandler(async () => {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : 5;

    const events = await getUpcomingEvents(limit);
    return { events };
  });
}
