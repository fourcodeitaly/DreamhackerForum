"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useRouter } from "next/navigation";
import { getTags } from "@/lib/db/tags/tags-get";
import { PresetSelector } from "../ui/present-selector";
import { SearchBox } from "../ui/search-box";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = "" }: SearchBarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [tagsList, setTagsList] = useState<{ name: string; id: string }[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await getTags();
      setTagsList(tags);
    };
    fetchTags();
  }, []);

  return (
    <SearchBox
      onSelect={(preset) => {
        router.push(`/posts?tag=${preset.id}`);
      }}
      presets={tagsList.map((tag) => ({
        id: tag.id,
        name: tag.name,
      }))}
    />
  );
}
