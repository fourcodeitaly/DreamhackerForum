"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/hooks/use-translation"
import { ArrowUp, Clock, Flame } from "lucide-react"
import type { CommentSortType } from "@/lib/types/comment"

interface CommentSorterProps {
  value: CommentSortType
  onChange: (value: CommentSortType) => void
}

export function CommentSorter({ value, onChange }: CommentSorterProps) {
  const { t } = useTranslation()

  const sortOptions: { value: CommentSortType; label: string; icon: React.ReactNode }[] = [
    {
      value: "top",
      label: t("sortByTop"),
      icon: <ArrowUp className="h-4 w-4" />,
    },
    {
      value: "new",
      label: t("sortByNew"),
      icon: <Clock className="h-4 w-4" />,
    },
    {
      value: "old",
      label: t("sortByOld"),
      icon: <Clock className="h-4 w-4 transform rotate-180" />,
    },
    {
      value: "controversial",
      label: t("sortByControversial"),
      icon: <Flame className="h-4 w-4" />,
    },
  ]

  const selectedOption = sortOptions.find((option) => option.value === value) || sortOptions[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          {selectedOption.icon}
          <span>{selectedOption.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-center gap-2"
          >
            {option.icon}
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
