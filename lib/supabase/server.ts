import { createServerClient } from "@supabase/ssr";
import type { Database } from "../database.types";
import { cookies } from "next/headers";

// Check if Supabase environment variables are available
export function hasSupabaseCredentials(): boolean {
  if (typeof window === "undefined") {
    // Server-side check
    return !!(
      process.env.SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.SUPABASE_ANON_KEY) &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  } else {
    // Client-side check
    return !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
}

// Create a single supabase client for the entire server-side application
export const createServerSupabaseClient = async () => {
  // This should only be called on the server
  const cookieStore = await cookies();

  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables for server client");
    return null;
  }

  try {
    return createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    });
  } catch (error) {
    console.error("Error creating server Supabase client:", error);
    return null;
  }
};

// Create a singleton client for client-side usage
