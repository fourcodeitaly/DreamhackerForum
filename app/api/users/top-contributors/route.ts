import { getTopContributors } from "@/lib/db/users/users-get";
import { requestErrorHandler } from "@/handler/error-handler";

export async function GET() {
  return requestErrorHandler(async () => {
    const contributors = await getTopContributors();
    return { contributors };
  });
}
