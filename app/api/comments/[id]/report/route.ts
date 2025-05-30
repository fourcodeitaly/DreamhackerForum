import { NextResponse } from "next/server";
import { commentReport } from "@/lib/db/comments/comments";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const commentId = id;

    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reason } = await request.json();

    const report = await commentReport(commentId, user.id, reason);

    if (!report) {
      return NextResponse.json(
        { error: "Failed to report comment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error reporting comment:", error);
    return NextResponse.json(
      { error: "Failed to report comment" },
      { status: 500 }
    );
  }
}
