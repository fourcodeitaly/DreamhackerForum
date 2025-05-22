import { getSchoolsGroupByNationCode } from "@/lib/db/tags/tags-get";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const schoolsGroupByNationCode = await getSchoolsGroupByNationCode();
    return NextResponse.json(schoolsGroupByNationCode);
  } catch (error) {
    console.error("Error fetching schools group by nation code:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
