import { NextResponse } from "next/server";
import { getTopContributors } from "@/lib/db/users-get";

export async function GET() {
  try {
    const contributors = await getTopContributors();
    return NextResponse.json(contributors);
  } catch (error) {
    console.error("Error fetching top contributors:", error);
    return NextResponse.json(
      { error: "Failed to fetch top contributors" },
      { status: 500 }
    );
  }
}
