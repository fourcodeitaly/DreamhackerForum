import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getUserFromSession } from "@/lib/auth-utils"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const commentId = id

  const supabase = await createServerSupabaseClient()
  if (!supabase) {
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
  }

  const user = await getUserFromSession()
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  try {
    const { reason } = await request.json()

    if (!reason) {
      return NextResponse.json({ error: "Reason is required" }, { status: 400 })
    }

    // Check if comment exists
    const { data: comment } = await supabase.from("comments").select("id").eq("id", commentId).single()

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 })
    }

    // Check if user already reported this comment
    const { data: existingReport } = await supabase
      .from("comment_reports")
      .select("id")
      .eq("comment_id", commentId)
      .eq("user_id", user.id)
      .single()

    if (existingReport) {
      return NextResponse.json({ error: "You have already reported this comment" }, { status: 400 })
    }

    // Create report
    const { error } = await supabase.from("comment_reports").insert({
      comment_id: commentId,
      user_id: user.id,
      reason,
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error reporting comment:", error)
    return NextResponse.json({ error: "Failed to report comment" }, { status: 500 })
  }
}
