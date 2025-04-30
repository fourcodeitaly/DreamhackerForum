import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago", "3 days ago")
 * @param date The date to format (can be a Date object, string, or number)
 * @returns A string representing the relative time
 */
export function formatRelativeTime(date: Date | string | number | null | undefined): string {
  if (!date) return "Unknown date"

  const now = new Date()
  let pastDate: Date

  try {
    // Handle different input types
    if (date instanceof Date) {
      pastDate = date
    } else if (typeof date === "number") {
      pastDate = new Date(date)
    } else if (typeof date === "string") {
      // Try to parse the string as a date
      pastDate = new Date(date)
    } else {
      return "Invalid date"
    }

    // Check if the date is valid
    if (isNaN(pastDate.getTime())) {
      return "Invalid date"
    }

    // Calculate the time difference in milliseconds
    const timeDiff = now.getTime() - pastDate.getTime()

    // Convert to seconds
    const seconds = Math.floor(timeDiff / 1000)

    // Define time intervals in seconds
    const minute = 60
    const hour = minute * 60
    const day = hour * 24
    const week = day * 7
    const month = day * 30
    const year = day * 365

    // Return appropriate relative time string
    if (seconds < 0) {
      return "in the future"
    } else if (seconds < 60) {
      return seconds === 1 ? "1 second ago" : `${seconds} seconds ago`
    } else if (seconds < hour) {
      const minutes = Math.floor(seconds / minute)
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`
    } else if (seconds < day) {
      const hours = Math.floor(seconds / hour)
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`
    } else if (seconds < week) {
      const days = Math.floor(seconds / day)
      return days === 1 ? "1 day ago" : `${days} days ago`
    } else if (seconds < month) {
      const weeks = Math.floor(seconds / week)
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
    } else if (seconds < year) {
      const months = Math.floor(seconds / month)
      return months === 1 ? "1 month ago" : `${months} months ago`
    } else {
      const years = Math.floor(seconds / year)
      return years === 1 ? "1 year ago" : `${years} years ago`
    }
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid date"
  }
}
