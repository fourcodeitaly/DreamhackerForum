"use client"

import { useAuth as useAuthContext } from "@/components/auth-provider"

export function useAuth() {
  return useAuthContext()
}
