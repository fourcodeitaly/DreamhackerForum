import { requestErrorHandler } from "@/handler/error-handler";
import { getRecentActivities } from "@/lib/db/activities/activities-modify";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return requestErrorHandler(async () => {
    const activities = await getRecentActivities(5);
    return activities;
  });
}
