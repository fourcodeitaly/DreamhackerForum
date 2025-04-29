"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  title: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

interface ToastState extends ToastProps {
  id: string
  visible: boolean
}

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const toast = ({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
    const id = `toast-${toastCount++}`

    setToasts((prev) => [
      ...prev,
      {
        id,
        title,
        description,
        variant,
        duration,
        visible: true,
      },
    ])

    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))

      // Remove from DOM after animation
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 300)
    }, duration)
  }

  return { toast, toasts }
}

export function ToastContainer() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "bg-white dark:bg-gray-800 rounded-lg shadow-lg border p-4 transition-all duration-300 transform",
            toast.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
            toast.variant === "destructive" && "border-red-500 dark:border-red-500",
          )}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3
                className={cn(
                  "font-medium text-sm",
                  toast.variant === "destructive" && "text-red-500 dark:text-red-400",
                )}
              >
                {toast.title}
              </h3>
              {toast.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => {
                setToasts((prev) => prev.map((t) => (t.id === toast.id ? { ...t, visible: false } : t)))
              }}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// Global state for toasts
const toastState: {
  toasts: ToastState[]
  setToasts: (toasts: ToastState[] | ((prev: ToastState[]) => ToastState[])) => void
} = {
  toasts: [],
  setToasts: (toasts) => {
    if (typeof toasts === "function") {
      toastState.toasts = toasts(toastState.toasts)
    } else {
      toastState.toasts = toasts
    }
  },
}

// Export the setToasts function for use in the ToastContainer
export const setToasts = toastState.setToasts
