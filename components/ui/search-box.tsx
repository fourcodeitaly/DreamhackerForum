"use client";

import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Check, Search } from "lucide-react";

import { cn } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";

interface SearchBoxProps extends PopoverProps {
  presets: { id: string; name: string }[];
  onSelect?: (preset: { id: string; name: string }) => void;
  defaultValue?: { id: string; name: string };
  className?: string;
}

export function SearchBox({
  presets,
  onSelect,
  defaultValue,
  className,
  ...props
}: SearchBoxProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 mt-4 z-50">
        <Command className="shadow-2xl">
          <CommandInput placeholder="Search ..." />
          <CommandList>
            <CommandGroup heading="Tags">
              {presets.map((preset, idx) => (
                <CommandItem
                  key={preset.id}
                  onSelect={() => {
                    router.push(`/posts?tag=${preset.id}`);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {preset.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
