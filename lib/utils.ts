import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Formats a date into a relative time string (e.g., "2 hours ago", "yesterday", "2 days ago")
 * @param date The date to format (Date object or ISO string)
 * @returns A string representing the relative time
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const past = typeof date === "string" ? new Date(date) : date

  if (isNaN(past.getTime())) {
    return "Invalid date"
  }

  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  // Less than a minute
  if (diffInSeconds < 60) {
    return "just now"
  }

  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  }

  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  }

  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    if (days === 1) {
      return "yesterday"
    }
    return `${days} days ago`
  }

  // Less than a month
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  }

  // Less than a year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  }

  // More than a year
  const years = Math.floor(diffInSeconds / 31536000)
  return `${years} ${years === 1 ? "year" : "years"} ago`
}

// If there are other existing utility functions in this file, they would be preserved here

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
