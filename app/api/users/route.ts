import { requestErrorHandler } from "@/handler/error-handler";
import { getUsers } from "@/lib/db/users/users-get";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { UnauthorizedError } from "@/handler/error";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return requestErrorHandler(async () => {
    const user = await getServerSession(authOptions);

    if (!user) {
      throw new UnauthorizedError();
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || 1;
    const limit = searchParams.get("limit") || 100;

    const users = await getUsers(Number(page), Number(limit));
    return users;
  });
}
