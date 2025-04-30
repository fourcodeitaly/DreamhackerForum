export async function getUserFromSession(supabase) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return null
    }

    const { data: user } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    return user
  } catch (error) {
    console.error("Error getting user from session:", error)
    return null
  }
}
