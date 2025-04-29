import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely format a date as a relative time string (e.g., "2 hours ago")
 * Falls back to "recently" if the date is invalid
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
  if (!dateString) return "recently"

  try {
    const date = new Date(dateString)
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "recently"
    }
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    return "recently"
  }
}
