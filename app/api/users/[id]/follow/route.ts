import { NextResponse } from "next/server";
import { followUser, unfollowUser } from "@/lib/db/follows/follows-modify";
import {
  getUserFollowStatus,
  getUserFollowers,
  getUserFollowing,
} from "@/lib/db/follows/follows-get";
import { createNotification } from "@/lib/db/notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const isFollowed = await getUserFollowStatus(user.id, id);

    if (type === "followers") {
      const followers = await getUserFollowers(id);
      return NextResponse.json({ followers });
    }

    if (type === "following") {
      const following = await getUserFollowing(id);
      return NextResponse.json({ following });
    }

    // Default response with follow status
    return NextResponse.json({ isFollowed });
  } catch (error) {
    console.error("Error getting user follow data:", error);
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
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

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

    // Prevent self-follow
    if (user.id === id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    const success =
      action === "follow"
        ? await followUser(user.id, id)
        : await unfollowUser(user.id, id);

    if (!success) {
      return NextResponse.json(
        { error: `Failed to ${action} user` },
        { status: 500 }
      );
    }

    // Create notification for the followed user

    if (action === "follow") {
      await createNotification({
        user_id: id,
        type: "follow",
        content: `${user.name} started following you`,
        link: `/profile/${user.username}`,
        sender_id: user.id,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling user follow:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
