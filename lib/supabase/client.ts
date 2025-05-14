import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../types/database.types";
import { localAuth } from "../auth/local-auth";
import { config } from "../config";
let clientSupabaseClient: ReturnType<
  typeof createBrowserClient<Database>
> | null = null;

// Update the createClientSupabaseClient function to include proper cookie settings
export const createClientSupabaseClient = () => {
  // If local auth is enabled in development, return null as we'll use local auth instead
  if (localAuth.isEnabled()) {
    return null;
  }

  if (clientSupabaseClient) return clientSupabaseClient;

  const supabaseUrl = config.supabaseUrl;
  const supabaseAnonKey = config.supabaseAnonKey;

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
