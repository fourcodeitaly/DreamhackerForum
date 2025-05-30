import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { queryOne } from "@/lib/db/postgres";
import { createNotification } from "@/lib/db/notification";
import { getUserByEmail } from "@/lib/db/users/users-get";
import { createUser } from "@/lib/db/users/user-modify";

export async function POST(req: Request) {
  try {
    const { email, password, name, username } = await req.json();

    // Validate input
    if (!email || !password || !name || !username) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const newUser = await createUser({
      email,
      name,
      username,
      role: "user",
      password,
    });

    if (!newUser) {
      console.error("Error creating user in database");
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: 500 }
      );
    }

    // Create welcome notification
    if (newUser) {
      await createNotification({
        user_id: newUser.id,
        sender_id: "b1663ba0-2ece-4bd7-af92-693678a4575d",
        type: "welcome",
        content: "Welcome to our community!",
      });
    }

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
