import { NextResponse } from "next/server";

export function requestErrorHandler(func: (...args: any[]) => Promise<any>) {
  return (async (...args: any[]) => {
    try {
      const response = await func(...args);
      const statusCode = response.statusCode || 200;

      return NextResponse.json(response, { status: statusCode });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "Internal Server Error";
      const errorResponse = { error: message, statusCode };

      return NextResponse.json(errorResponse, { status: statusCode });
    }
  })();
}
