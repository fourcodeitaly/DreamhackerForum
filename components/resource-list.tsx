"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/use-translation"
import { FileText, Video, LinkIcon } from "lucide-react"

export function ResourceList() {
  const { t } = useTranslation()
  const [resources, setResources] = useState<any[]>([])

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      case "link":
        return <LinkIcon className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {resources.map((resource) => (
        <Card key={resource.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <Badge>{resource.type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {resource.tags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {t("addedBy")}: {resource.author}
            </div>
            <Button size="sm" className="gap-1">
              {getResourceIcon(resource.type)}
              {resource.type === "pdf" ? t("download") : t("view")}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
