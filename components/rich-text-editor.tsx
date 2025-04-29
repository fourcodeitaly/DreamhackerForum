"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, LinkIcon, ImageIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({ value, onChange, placeholder = "", className }: RichTextEditorProps) {
  const [editorContent, setEditorContent] = useState(value)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.innerHTML
    setEditorContent(content)
    onChange(content)
  }

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      const content = editorRef.current.innerHTML
      setEditorContent(content)
      onChange(content)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault()
      execCommand("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;")
    }
  }

  return (
    <div className={cn("border rounded-md flex flex-col", className)}>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("bold")}>
          <Bold className="h-4 w-4" />
          <span className="sr-only">Bold</span>
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("italic")}>
          <Italic className="h-4 w-4" />
          <span className="sr-only">Italic</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("insertUnorderedList")}
        >
          <List className="h-4 w-4" />
          <span className="sr-only">Bullet List</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("insertOrderedList")}
        >
          <ListOrdered className="h-4 w-4" />
          <span className="sr-only">Numbered List</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            const url = prompt("Enter link URL:")
            if (url) execCommand("createLink", url)
          }}
        >
          <LinkIcon className="h-4 w-4" />
          <span className="sr-only">Insert Link</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("justifyLeft")}
        >
          <AlignLeft className="h-4 w-4" />
          <span className="sr-only">Align Left</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("justifyCenter")}
        >
          <AlignCenter className="h-4 w-4" />
          <span className="sr-only">Align Center</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("justifyRight")}
        >
          <AlignRight className="h-4 w-4" />
          <span className="sr-only">Align Right</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            const url = prompt("Enter image URL:")
            if (url) execCommand("insertImage", url)
          }}
        >
          <ImageIcon className="h-4 w-4" />
          <span className="sr-only">Insert Image</span>
        </Button>
      </div>
      <div
        ref={editorRef}
        className="min-h-[200px] p-3 outline-none overflow-auto"
        contentEditable
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        data-placeholder={placeholder}
        style={{
          minHeight: "200px",
          maxHeight: "500px",
        }}
      />
    </div>
  )
}
