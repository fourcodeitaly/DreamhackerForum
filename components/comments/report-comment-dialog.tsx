"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/hooks/use-translation"
import { AlertCircle, Flag, Loader2 } from "lucide-react"

interface ReportCommentDialogProps {
  commentId: string
  isOpen: boolean
  onClose: () => void
}

export function ReportCommentDialog({ commentId, isOpen, onClose }: ReportCommentDialogProps) {
  const { t } = useTranslation()
  const [reason, setReason] = useState<string>("spam")
  const [customReason, setCustomReason] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const reportReason = reason === "other" ? customReason : reason

    if (!reportReason.trim()) {
      setError(t("pleaseProvideReason"))
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/comments/${commentId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: reportReason }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to report comment")
      }

      setIsSuccess(true)

      // Close dialog after a short delay
      setTimeout(() => {
        onClose()
        // Reset state after closing
        setTimeout(() => {
          setIsSuccess(false)
          setReason("spam")
          setCustomReason("")
        }, 300)
      }, 1500)
    } catch (err) {
      console.error("Error reporting comment:", err)
      setError(err instanceof Error ? err.message : "Failed to report comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            {t("reportComment")}
          </DialogTitle>
          <DialogDescription>{t("reportCommentDescription")}</DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-primary/10 p-3">
              <Flag className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{t("reportSubmitted")}</h3>
            <p className="mt-1 text-center text-muted-foreground">{t("reportSubmittedDescription")}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <RadioGroup value={reason} onValueChange={setReason}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="spam" id="spam" />
                <Label htmlFor="spam">{t("spam")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="harassment" id="harassment" />
                <Label htmlFor="harassment">{t("harassment")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="misinformation" id="misinformation" />
                <Label htmlFor="misinformation">{t("misinformation")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hate_speech" id="hate_speech" />
                <Label htmlFor="hate_speech">{t("hateSpeech")}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">{t("other")}</Label>
              </div>
            </RadioGroup>

            {reason === "other" && (
              <Textarea
                placeholder={t("pleaseSpecify")}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="resize-none"
                disabled={isSubmitting}
              />
            )}

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting || (reason === "other" && !customReason.trim())}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("submitting")}
                  </>
                ) : (
                  t("submitReport")
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
