"use client";

import { useNotifications as useNotificationsContext } from "@/components/providers/notification-provider";

export function useNotifications() {
  return useNotificationsContext();
}
