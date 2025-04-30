"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/hooks/use-translation"
import { Loader2, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Markdown } from "@/components/markdown"
import type { Comment } from "@/lib/types/comment"

interface CommentEditorProps {
  comment: Comment
  onCancel: () => void
  onUpdate: (comment: Comment) => void
}

export function CommentEditor({ comment, onCancel, onUpdate }: CommentEditorProps) {
  const { t } = useTranslation()
  const [content, setContent] = useState(comment.content)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("write")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          is_markdown: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update comment")
      }

      const data = await response.json()
      onUpdate(data.comment)
    } catch (err) {
      console.error("Error updating comment:", err)
      setError(err instanceof Error ? err.message : "Failed to update comment")
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
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          {t("cancel")}
        </Button>

        <Button type="submit" disabled={isSubmitting || !content.trim() || content === comment.content}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("saving")}
            </>
          ) : (
            t("saveChanges")
          )}
        </Button>
      </div>
    </form>
  )
}
