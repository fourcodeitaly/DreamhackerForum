"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { Bold, Italic, Link, Code, List } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
}: MarkdownEditorProps) {
  const { t } = useTranslation();
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  const handleTextareaSelect = (
    e: React.SyntheticEvent<HTMLTextAreaElement>
  ) => {
    const textarea = e.target as HTMLTextAreaElement;
    setSelectionStart(textarea.selectionStart);
    setSelectionEnd(textarea.selectionEnd);
  };

  const insertMarkdown = (before: string, after = "") => {
    const newValue =
      value.substring(0, selectionStart) +
      before +
      value.substring(selectionStart, selectionEnd) +
      after +
      value.substring(selectionEnd);

    onChange(newValue);
  };

  const handleBold = () => insertMarkdown("**", "**");
  const handleItalic = () => insertMarkdown("*", "*");
  const handleLink = () => {
    const selectedText = value.substring(selectionStart, selectionEnd);
    if (selectedText) {
      insertMarkdown(`[${selectedText}](`, ")");
    } else {
      insertMarkdown("[", "](url)");
    }
  };
  const handleCode = () => insertMarkdown("`", "`");
  const handleList = () => insertMarkdown("\n- ");

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 border-b pb-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleBold}
          disabled={disabled}
          title={t("bold")}
        >
          <Bold className="h-4 w-4" />
          <span className="sr-only">{t("bold")}</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleItalic}
          disabled={disabled}
          title={t("italic")}
        >
          <Italic className="h-4 w-4" />
          <span className="sr-only">{t("italic")}</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleLink}
          disabled={disabled}
          title={t("link")}
        >
          <Link className="h-4 w-4" />
          <span className="sr-only">{t("link")}</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCode}
          disabled={disabled}
          title={t("code")}
        >
          <Code className="h-4 w-4" />
          <span className="sr-only">{t("code")}</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleList}
          disabled={disabled}
          title={t("list")}
        >
          <List className="h-4 w-4" />
          <span className="sr-only">{t("list")}</span>
        </Button>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleTextareaSelect}
        placeholder={placeholder}
        className="min-h-[300px] lg:min-h-[500px] font-mono text-sm"
        disabled={disabled}
      />
    </div>
  );
}
