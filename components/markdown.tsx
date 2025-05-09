"use client";

import { useEffect, useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
  preview?: boolean;
  maxPreviewLength?: number;
}

// Memoized regex patterns for better performance
const MARKDOWN_PATTERNS = {
  headings: /#+\s/g,
  bold: /\*\*/g,
  italic: /\*/g,
  links: /\[([^\]]+)\]\([^)]+\)/g,
  images: /!\[([^\]]+)\]\([^)]+\)/g,
  inlineCode: /`([^`]+)`/g,
  codeBlocks: /```[\s\S]*?```/g,
  blockquotes: />\s/g,
  listItems: /- /g,
  numberedList: /\d+\. /g,
} as const;

export function Markdown({
  content,
  className,
  preview = false,
  maxPreviewLength = 200,
}: MarkdownProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize the stripped content for preview mode
  const strippedContent = useMemo(() => {
    if (!preview) return null;

    return content
      .replace(MARKDOWN_PATTERNS.headings, "")
      .replace(MARKDOWN_PATTERNS.bold, "")
      .replace(MARKDOWN_PATTERNS.italic, "")
      .replace(MARKDOWN_PATTERNS.links, "$1")
      .replace(MARKDOWN_PATTERNS.images, "$1")
      .replace(MARKDOWN_PATTERNS.inlineCode, "$1")
      .replace(MARKDOWN_PATTERNS.codeBlocks, "")
      .replace(MARKDOWN_PATTERNS.blockquotes, "")
      .replace(MARKDOWN_PATTERNS.listItems, "")
      .replace(MARKDOWN_PATTERNS.numberedList, "")
      .trim();
  }, [content, preview]);

  // Memoize the limited text for preview mode
  const limitedText = useMemo(() => {
    if (!strippedContent) return null;
    return strippedContent.length > maxPreviewLength
      ? `${strippedContent.substring(0, maxPreviewLength)}...`
      : strippedContent;
  }, [strippedContent, maxPreviewLength]);

  // Show preview mode
  if (preview) {
    return (
      <p className={cn("text-sm line-clamp-3", className)}>{limitedText}</p>
    );
  }

  // Show loading state during SSR
  if (!mounted) {
    return (
      <div
        className={cn("animate-pulse bg-muted rounded-md", "h-40 w-full")}
        aria-label="Loading content"
      />
    );
  }

  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-none",
        "prose-headings:font-semibold",
        "prose-a:text-primary hover:prose-a:text-primary/80",
        "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
        "prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg",
        "prose-img:rounded-lg prose-img:shadow-md",
        "prose-blockquote:border-l-4 prose-blockquote:border-primary/50",
        "prose-ul:list-disc prose-ol:list-decimal",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Custom component overrides
          code: ({ node, inline, className, children, ...props }) => (
            <code
              className={cn(
                "font-mono text-sm",
                inline
                  ? "bg-muted px-1.5 py-0.5 rounded"
                  : "block p-4 rounded-lg",
                className
              )}
              {...props}
            >
              {children}
            </code>
          ),
          img: ({ node, ...props }) => (
            <img loading="lazy" className="rounded-lg shadow-md" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
