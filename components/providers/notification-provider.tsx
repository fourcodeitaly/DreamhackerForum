"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getMockNotifications } from "@/mocks/mock-data";
import { useTranslation } from "@/hooks/use-translation";
interface NotificationContextType {
  notifications: any[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<any[]>([]);
  // useEffect(() => {
  //   if (user) {
  //     // Simulate fetching notifications
  //     const mockNotifications = getMockNotifications();
  //     setNotifications(mockNotifications);

  //     // Show toast for unread notifications
  //     const unreadCount = mockNotifications.filter((n) => !n.read).length;
  //     if (unreadCount > 0) {
  //       toast({
  //         title: t("loginSuccess"),
  //         description: t("welcomeBack"),
  //       });
  //     }
  //   } else {
  //     setNotifications([]);
  //   }
  // }, [user, toast]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
