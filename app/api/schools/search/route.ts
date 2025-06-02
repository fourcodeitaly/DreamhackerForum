import { requestErrorHandler } from "@/handler/error-handler";
import { getSchoolsIdAndName } from "@/lib/db/schools/school-get";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return requestErrorHandler(async () => {
    const schools = await getSchoolsIdAndName();
    return schools;
  });
}
