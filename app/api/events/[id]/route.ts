import { NextRequest } from "next/server";
import { getEventById } from "@/lib/db/events/event-get";
import { updateEvent, deleteEvent } from "@/lib/db/events/event-modify";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { requestErrorHandler } from "@/handler/error-handler";
import { ForbiddenError, UnauthorizedError } from "@/handler/error";
import { InternalServerError, NotFoundError } from "@/handler/error";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requestErrorHandler(async () => {
    const { id } = await params;

    const event = await getEventById(id);

    if (event?.is_published) {
      const session = await getServerSession(authOptions);
      const user = session?.user;
      if (!user || user.role !== "admin" || user.id !== event.created_user_id) {
        throw new UnauthorizedError();
      }
    }

    if (!event) {
      throw new NotFoundError();
    }
    return { event };
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requestErrorHandler(async () => {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user || user.role !== "admin") {
      throw new UnauthorizedError();
    }

    // Get the event to check ownership
    const event = await getEventById(id);

    if (
      event?.is_published &&
      (user.role !== "admin" || user.id !== event.created_user_id)
    ) {
      throw new UnauthorizedError();
    }

    if (!event) {
      throw new NotFoundError();
    }

    // Check if user owns the event or is admin
    if (event.created_user_id !== user.id && user.role !== "admin") {
      throw new ForbiddenError();
    }

    const data = await request.json();
    const updatedEvent = await updateEvent(id, data);

    if (!updatedEvent) {
      throw new InternalServerError();
    }

    return { event: updatedEvent };
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return requestErrorHandler(async () => {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      throw new UnauthorizedError();
    }

    // Get the event to check ownership
    const event = await getEventById(id);

    if (!event) {
      throw new NotFoundError();
    }

    // Check if user owns the event or is admin
    if (event.created_user_id !== user.id && user.role !== "admin") {
      throw new ForbiddenError();
    }

    const success = await deleteEvent(id);

    if (!success) {
      throw new InternalServerError();
    }

    return { success: true };
  });
}
