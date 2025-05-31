"use client";

import type React from "react";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { SearchBox } from "../ui/search-box";
import { getSchoolsIdAndName } from "@/lib/db/schools/school-get";

export function SearchBar() {
  const router = useRouter();
  const [items, setItems] = useState<{ name: string; id: string }[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      let fetchedItems: { name: string; id: string }[] = [];
      fetchedItems = await getSchoolsIdAndName();
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
