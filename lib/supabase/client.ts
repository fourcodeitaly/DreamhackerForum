import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../database.types";

let clientSupabaseClient: ReturnType<
  typeof createBrowserClient<Database>
> | null = null;

// Update the createClientSupabaseClient function to include proper cookie settings
export const createClientSupabaseClient = () => {
  if (clientSupabaseClient) return clientSupabaseClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables for client client");
    return null;
  }

  try {
    clientSupabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return clientSupabaseClient;
  } catch (error) {
    console.error("Error creating client Supabase client:", error);
    return null;
  }
};
