"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { FacetCount } from "@/lib/types";

const MAX_VISIBLE = 50;

interface FacetMultiselectProps {
  label: string;
  options: FacetCount[];
  selected: string[];
  onChange: (next: string[]) => void;
  isLoading?: boolean;
  emptyText?: string;
}

export function FacetMultiselect({
  label,
  options,
  selected,
  onChange,
  isLoading = false,
  emptyText = "No options yet.",
}: FacetMultiselectProps) {
  const [filter, setFilter] = useState("");

  const visible = useMemo(() => {
    const f = filter.trim().toLowerCase();
    const filtered = f
      ? options.filter((o) => o.name.toLowerCase().includes(f))
      : options;
    return filtered.slice(0, MAX_VISIBLE);
  }, [filter, options]);

  const toggle = (name: string) => {
    onChange(
      selected.includes(name)
        ? selected.filter((s) => s !== name)
        : [...selected, name],
    );
  };

  return (
    <Popover>
      <PopoverTrigger
        className="flex h-8 w-fit items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors hover:bg-accent/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50"
        data-slot="facet-multiselect-trigger"
      >
        <span>{label}</span>
        {selected.length > 0 ? (
          <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
            {selected.length}
          </Badge>
        ) : null}
        <ChevronDown className="size-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <div className="border-b border-border/40 p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={`Filter ${label.toLowerCase()}...`}
              className="h-8 pl-7"
              autoFocus
            />
          </div>
        </div>
        <div
          className="max-h-72 overflow-y-auto p-1"
          role="listbox"
          aria-multiselectable
        >
          {isLoading ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">Loading…</p>
          ) : visible.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-muted-foreground">
              {filter ? `No matches for "${filter}"` : emptyText}
            </p>
          ) : (
            visible.map((opt) => {
              const isSelected = selected.includes(opt.name);
              return (
                <button
                  key={opt.name}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggle(opt.name)}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-accent focus:bg-accent"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded border border-input",
                        isSelected &&
                          "border-primary bg-primary text-primary-foreground",
                      )}
                    >
                      {isSelected ? <Check className="size-3" /> : null}
                    </span>
                    <span className="truncate">{opt.name}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {opt.count}
                  </span>
                </button>
              );
            })
          )}
        </div>
        {selected.length > 0 ? (
          <div className="border-t border-border/40 p-1">
            <button
              type="button"
              onClick={() => onChange([])}
              className="w-full rounded-md px-2 py-1 text-left text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              Clear ({selected.length} selected)
            </button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
