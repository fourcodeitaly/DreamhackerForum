import { NextRequest, NextResponse } from "next/server";
import { getEvents } from "@/lib/db/events/event-get";
import { createEvent } from "@/lib/db/events/event-modify";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const options = {
      page: searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
      type: searchParams.get("type") || undefined,
      isVirtual: searchParams.get("isVirtual")
        ? searchParams.get("isVirtual") === "true"
        : undefined,
      isPublished: searchParams.get("isPublished")
        ? searchParams.get("isPublished") === "true"
        : undefined,
      status: searchParams.get("status") || undefined,
      startDate: searchParams.get("startDate")
        ? new Date(searchParams.get("startDate")!)
        : undefined,
      endDate: searchParams.get("endDate")
        ? new Date(searchParams.get("endDate")!)
        : undefined,
      search: searchParams.get("search") || undefined,
      schoolcode: searchParams.get("schoolcode") || undefined,
    };

    const events = await getEvents(options);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getServerSession(authOptions);

    if (!user || user.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const event = await createEvent({
      ...data,
      created_user_id: user.user?.id,
    });

    if (!event) {
      return NextResponse.json(
        { error: "Failed to create event" },
        { status: 500 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
