"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/hooks/use-translation"
import { Loader2, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Markdown } from "@/components/markdown"
import type { Comment } from "@/lib/types/comment"

interface CommentFormProps {
  postId: string
  parentId?: string
  onCommentSubmit: (comment: Comment) => void
  onCancel?: () => void
  isReply?: boolean
}

export function CommentForm({ postId, parentId, onCommentSubmit, onCancel, isReply = false }: CommentFormProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("write")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !content.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          parent_id: parentId,
          content: content.trim(),
          is_markdown: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit comment")
      }

      const data = await response.json()
      onCommentSubmit(data.comment)
      setContent("")
      setActiveTab("write")
    } catch (err) {
      console.error("Error submitting comment:", err)
      setError(err instanceof Error ? err.message : "Failed to submit comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-2 grid w-full grid-cols-2">
          <TabsTrigger value="write">{t("write")}</TabsTrigger>
          <TabsTrigger value="preview" disabled={!content.trim()}>
            {t("preview")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="mt-0">
          <Textarea
            placeholder={isReply ? t("writeReply") : t("writeComment")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-2 focus-visible:ring-primary/50"
            disabled={isSubmitting}
          />
          <div className="mt-1 text-xs text-muted-foreground">{t("markdownSupported")}</div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div className="min-h-[100px] rounded-md border-2 border-input bg-background p-3">
            {content.trim() ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown content={content} />
              </div>
            ) : (
              <p className="text-muted-foreground">{t("noContent")}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t("cancel")}
          </Button>
        )}

        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="relative overflow-hidden transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("submitting")}
            </>
          ) : (
            t(isReply ? "submitReply" : "submitComment")
          )}
        </Button>
      </div>
    </form>
  )
}
