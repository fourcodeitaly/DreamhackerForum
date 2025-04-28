"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/hooks/use-translation"
import { ChevronDown, Flame, Clock, MessageSquare } from "lucide-react"

export function SortFilter() {
  const { t } = useTranslation()
  const [sortOption, setSortOption] = useState("newest")

  const sortOptions = [
    { id: "newest", label: t("newest"), icon: Clock },
    { id: "popular", label: t("popular"), icon: Flame },
    { id: "mostCommented", label: t("mostCommented"), icon: MessageSquare },
  ]

  const currentOption = sortOptions.find((option) => option.id === sortOption)

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">{t("sortBy")}:</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            {currentOption && (
              <>
                <currentOption.icon className="mr-2 h-4 w-4" />
                {currentOption.label}
              </>
            )}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {sortOptions.map((option) => (
            <DropdownMenuItem key={option.id} onClick={() => setSortOption(option.id)} className="flex items-center">
              <option.icon className="mr-2 h-4 w-4" />
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
