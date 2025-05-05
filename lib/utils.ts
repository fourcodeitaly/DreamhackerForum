import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago", "3 days ago")
 * @param date The date to format
 * @returns A string representing the relative time
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInMs = now.getTime() - past.getTime()

  // Convert to seconds
  const diffInSecs = Math.floor(diffInMs / 1000)

  // Less than a minute
  if (diffInSecs < 60) {
    return "just now"
  }

  // Less than an hour
  if (diffInSecs < 3600) {
    const minutes = Math.floor(diffInSecs / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  }

  // Less than a day
  if (diffInSecs < 86400) {
    const hours = Math.floor(diffInSecs / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  }

  // Less than a week
  if (diffInSecs < 604800) {
    const days = Math.floor(diffInSecs / 86400)
    return `${days} ${days === 1 ? "day" : "days"} ago`
  }

  // Less than a month
  if (diffInSecs < 2592000) {
    const weeks = Math.floor(diffInSecs / 604800)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  }

  // Less than a year
  if (diffInSecs < 31536000) {
    const months = Math.floor(diffInSecs / 2592000)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  }

  // More than a year
  const years = Math.floor(diffInSecs / 31536000)
  return `${years} ${years === 1 ? "year" : "years"} ago`
}
