import { requestErrorHandler } from "@/handler/error-handler";
import { getUserById } from "@/lib/db/users/users-get";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { UnauthorizedError } from "@/handler/error";
import { authOptions } from "../[...nextauth]/route";

export async function GET(request: NextRequest) {
  return requestErrorHandler(async () => {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      throw new UnauthorizedError();
    }

    const userData = await getUserById(user.id);
    return userData;
  });
}
