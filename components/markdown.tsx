"use client"

import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface MarkdownProps {
  content: string
  className?: string
  preview?: boolean
}

export function Markdown({ content, className, preview = false }: MarkdownProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // For preview mode, strip markdown and limit length
  if (preview) {
    // Strip markdown syntax
    const plainText = content
      .replace(/#+\s/g, "") // Remove headings
      .replace(/\*\*/g, "") // Remove bold
      .replace(/\*/g, "") // Remove italic
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1") // Replace links with just text
      .replace(/!\[([^\]]+)\]$$[^)]+$$/g, "$1") // Replace images with alt text
      .replace(/`([^`]+)`/g, "$1") // Remove inline code
      .replace(/```[\s\S]*?```/g, "") // Remove code blocks
      .replace(/>\s/g, "") // Remove blockquotes
      .replace(/- /g, "") // Remove list items
      .replace(/\d+\. /g, "") // Remove numbered list items
      .trim()

    // Limit to 200 characters
    const limitedText = plainText.length > 200 ? `${plainText.substring(0, 200)}...` : plainText

    return <p className={cn("text-sm", className)}>{limitedText}</p>
  }

  // Show loading state during SSR
  if (!mounted) {
    return <div className="animate-pulse bg-muted h-40 rounded-md" />
  }

  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  )
}
