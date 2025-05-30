import { NextRequest, NextResponse } from "next/server";
import { getEventById } from "@/lib/db/events/event-get";
import { updateEvent, deleteEvent } from "@/lib/db/events/event-modify";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const event = await getEventById(id);

    if (event?.is_published) {
      const session = await getServerSession(authOptions);
      const user = session?.user;
      if (!user || user.role !== "admin" || user.id !== event.created_user_id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the event to check ownership
    const event = await getEventById(id);

    if (
      event?.is_published &&
      (user.role !== "admin" || user.id !== event.created_user_id)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user owns the event or is admin
    if (event.created_user_id !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to edit this event" },
        { status: 403 }
      );
    }

    const data = await request.json();
    const updatedEvent = await updateEvent(id, data);

    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Failed to update event" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the event to check ownership
    const event = await getEventById(id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user owns the event or is admin
    if (event.created_user_id !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Not authorized to delete this event" },
        { status: 403 }
      );
    }

    const success = await deleteEvent(id);

    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete event" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
