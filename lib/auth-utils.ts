import { createServerSupabaseClient } from "./supabase/server";

export async function getUserFromSession() {
  try {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      return null;
    }

    // const test = await supabase.auth.getUserIdentities();
    // console.log("test", test);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    return userData;
  } catch (error) {
    console.error("Error getting user from session:", error);
    return null;
  }
}
