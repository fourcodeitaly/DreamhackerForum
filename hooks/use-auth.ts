"use client";

import { useAuth as useAuthContext } from "@/components/providers/auth-provider";

export function useAuth() {
  return useAuthContext();
}
