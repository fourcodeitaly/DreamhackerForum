"use client"

import { useNotifications as useNotificationsContext } from "@/components/notification-provider"

export function useNotifications() {
  return useNotificationsContext()
}
