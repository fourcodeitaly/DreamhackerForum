"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/use-translation";
import { Bold, Italic, Link, Code, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Markdown } from "@/components/markdown";

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
  const [activeTab, setActiveTab] = useState<string>("write");

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
      {/* Mobile view with tabs */}
      <div className="lg:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-2">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="write">{t("write")}</TabsTrigger>
              <TabsTrigger value="preview" disabled={!value.trim()}>
                {t("preview")}
              </TabsTrigger>
            </TabsList>
            <div className="flex flex-wrap gap-1">
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
          </div>

          <TabsContent value="write" className="mt-0">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onSelect={handleTextareaSelect}
              placeholder={placeholder}
              disabled={disabled}
              className="min-h-[200px] lg:min-h-[500px] resize-none"
            />
          </TabsContent>

          <TabsContent value="preview" className="mt-0">
            <div className="min-h-[200px] lg:min-h-[500px] rounded-md border-2 border-input bg-background p-3 overflow-auto">
              {value.trim() ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <Markdown content={value} />
                </div>
              ) : (
                <p className="text-muted-foreground">{t("noContent")}</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop view with side-by-side */}
      <div className="hidden lg:block">
        <div className="flex justify-end mb-2">
          <div className="flex flex-wrap gap-1">
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onSelect={handleTextareaSelect}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[300px] lg:min-h-[500px]"
          />
          <div className="min-h-[300px] lg:min-h-[500px] rounded-md border-2 border-input bg-background p-3 overflow-auto">
            {value.trim() ? (
              <div className="prose prose-sm dark:prose-invert max-w-none h-[200px] lg:h-[500px]">
                <Markdown content={value} maxPreviewLength={200} />
              </div>
            ) : (
              <p className="text-muted-foreground">{t("noContent")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
