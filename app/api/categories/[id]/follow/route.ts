import { NextResponse } from "next/server";
import {
  followCategory,
  unfollowCategory,
} from "@/lib/db/follows/follows-modify";
import {
  getCategoryFollowStatus,
  getCategoryFollowers,
} from "@/lib/db/follows/follows-get";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerSession(authOptions);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const isFollowed = await getCategoryFollowStatus(user.user?.id, params.id);

    if (type === "followers") {
      const followers = await getCategoryFollowers(params.id);
      return NextResponse.json({ followers });
    }

    // Default response with follow status
    return NextResponse.json({ isFollowed });
  } catch (error) {
    console.error("Error getting category follow data:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getServerSession(authOptions);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    if (!action || (action !== "follow" && action !== "unfollow")) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const success =
      action === "follow"
        ? await followCategory(user.user?.id, params.id)
        : await unfollowCategory(user.user?.id, params.id);

    if (!success) {
      return NextResponse.json(
        { error: `Failed to ${action} category` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling category follow:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
