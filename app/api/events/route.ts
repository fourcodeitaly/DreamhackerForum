import { NextRequest } from "next/server";
import { getEvents } from "@/lib/db/events/event-get";
import { createEvent } from "@/lib/db/events/event-modify";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { requestErrorHandler } from "@/handler/error-handler";
import { InternalServerError, UnauthorizedError } from "@/handler/error";

export async function GET(request: NextRequest) {
  return requestErrorHandler(async () => {
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
      schoolId: searchParams.get("schoolId") || undefined,
    };

    const events = await getEvents(options);
    return { events };
  });
}

export async function POST(request: NextRequest) {
  return requestErrorHandler(async () => {
    const user = await getServerSession(authOptions);

    if (!user || user.user?.role !== "admin") {
      throw new UnauthorizedError();
    }

    const data = await request.json();
    const event = await createEvent({
      ...data,
      created_user_id: user.user?.id,
    });

    if (!event) {
      throw new InternalServerError();
    }

    return event;
  });
}
