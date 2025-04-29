import { seedAdminUser } from "@/lib/seed-admin"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const user = await seedAdminUser()

    if (user) {
      return NextResponse.json({
        success: true,
        message: "Admin user created successfully",
        user: { email: user.email },
      })
    } else {
      return NextResponse.json({ success: false, message: "Failed to create admin user" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in seed admin route:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
