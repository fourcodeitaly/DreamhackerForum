"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBox } from "../ui/search-box";

export function SearchBar() {
  const router = useRouter();
  const [items, setItems] = useState<{ name: string; id: string }[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      let fetchedItems: { name: string; id: string }[] = [];
      const response = await fetch("/api/schools/search");
      if (!response.ok) {
        throw new Error("Failed to fetch schools");
      }
      fetchedItems = (await response.json()) as { name: string; id: string }[];

      setItems(fetchedItems);
    };

    fetchItems();
  }, []);

  return (
    <SearchBox
      onSelect={(preset) => {
        router.push("/schools/" + preset.id);
      }}
      presets={items.map((item) => ({
        id: item.id,
        name: item.name,
      }))}
    />
  );
}
