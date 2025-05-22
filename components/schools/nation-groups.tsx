"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/utils/utils";

interface NationGroupsProps {
  nations: string[];
  selectedNation: string;
}

export function NationGroups({ nations, selectedNation }: NationGroupsProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNationClick = (nation: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("nation", nation);
    router.push(`/schools?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-lg flex items-center">
          <Globe className="h-5 w-5 mr-2 text-primary" />
          {t("nations")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-1 lg:max-h-[600px] overflow-y-auto">
          {nations.sort().map((nation) => (
            <button
              key={nation}
              onClick={() => handleNationClick(nation)}
              className={cn(
                "w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors",
                nation === selectedNation
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {nation}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
