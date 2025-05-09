import { NextResponse } from "next/server"
import { getPostById } from "@/lib/db/posts/post-get"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const post = await getPostById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
