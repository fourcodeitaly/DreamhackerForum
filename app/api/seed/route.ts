import { seedTestUser } from "@/lib/seed-user"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await seedTestUser()

    if (user) {
      return NextResponse.json({
        success: true,
        message: "Test user created successfully",
        user: { email: user.email },
      })
    } else {
      return NextResponse.json({ success: false, message: "Failed to create test user" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in seed route:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
