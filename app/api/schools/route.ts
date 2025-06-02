import { requestErrorHandler } from "@/handler/error-handler";
import { getSchools, getSchoolsIdAndName } from "@/lib/db/schools/school-get";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return requestErrorHandler(async () => {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");
    const orderBy = searchParams.get("orderBy");
    const nationCode = searchParams.get("nationCode");

    const schools = await getSchools({
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null,
      orderBy,
      nationCode,
    });

    return schools;
  });
}
