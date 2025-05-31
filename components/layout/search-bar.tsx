"use client";

import type React from "react";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { getTags } from "@/lib/db/tags/tags-get";
import { SearchBox } from "../ui/search-box";

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className = "" }: SearchBarProps) {
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
