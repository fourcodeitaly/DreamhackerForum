import { followUser, unfollowUser } from "@/lib/db/follows/follows-modify";
import {
  getUserFollowStatus,
  getUserFollowers,
  getUserFollowing,
} from "@/lib/db/follows/follows-get";
import { createNotification } from "@/lib/db/notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { requestErrorHandler } from "@/handler/error-handler";
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "@/handler/error";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return requestErrorHandler(async () => {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      throw new UnauthorizedError();
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const isFollowed = await getUserFollowStatus(user.id, id);

    if (type === "followers") {
      const followers = await getUserFollowers(id);
      return { followers };
    }

    if (type === "following") {
      const following = await getUserFollowing(id);
      return { following };
    }

    // Default response with follow status
    return { isFollowed };
  });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  return requestErrorHandler(async () => {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      throw new UnauthorizedError();
    }

    const { action } = await request.json();

    if (!action || (action !== "follow" && action !== "unfollow")) {
      throw new BadRequestError();
    }

    // Prevent self-follow
    if (user.id === id) {
      throw new BadRequestError();
    }

    const success =
      action === "follow"
        ? await followUser(user.id, id)
        : await unfollowUser(user.id, id);

    if (!success) {
      throw new InternalServerError();
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

    return { success: true };
  });
}
