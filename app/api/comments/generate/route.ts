import { generateComments } from "@/works/generate_comments";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { requestErrorHandler } from "@/handler/error-handler";
import { BadRequestError, UnauthorizedError } from "@/handler/error";

export async function GET(request: Request) {
  return requestErrorHandler(async () => {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (user?.role !== "admin") {
      throw new UnauthorizedError();
    }

    if (!postId) {
      throw new BadRequestError();
    }

    const success = await generateComments(postId);
    return { success };
  });
}
