"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { KindIcon } from "@/components/catalog/kind-icon";
import { KIND_META } from "@/lib/catalog/kind-meta";
import type { CatalogKind } from "@/lib/catalog/kind-colors";
import { useSearch } from "@/lib/hooks/use-search";
import { useCommandPalette } from "@/lib/hooks/use-command-palette";
import { cn } from "@/lib/utils";
import type { SearchResponse } from "@/lib/types";

const GROUP_ORDER: CatalogKind[] = [
  "featureset",
  "dataset",
  "pipeline",
  "source",
  "tag",
  "owner",
];

interface PaletteItem {
  kind: CatalogKind;
  name: string;
  href: string;
  hint?: string;
}

function flatten(data: SearchResponse): PaletteItem[] {
  const items: PaletteItem[] = [];
  for (const fs of data.featuresets) {
    items.push({
      kind: "featureset",
      name: fs.name,
      href: KIND_META.featureset.href(fs.name),
    });
  }
  for (const ds of data.datasets) {
    items.push({
      kind: "dataset",
      name: ds.name,
      href: KIND_META.dataset.href(ds.name),
    });
  }
  for (const pipe of data.pipelines) {
    items.push({
      kind: "pipeline",
      name: pipe.name,
      href: KIND_META.pipeline.href(pipe.name),
    });
  }
  for (const src of data.sources) {
    items.push({
      kind: "source",
      name: src.dataset,
      href: KIND_META.source.href(src.id),
    });
  }
  for (const t of data.tags) {
    items.push({
      kind: "tag",
      name: t.name,
      href: KIND_META.tag.href(t.name),
      hint: String(t.count),
    });
  }
  for (const o of data.owners) {
    items.push({
      kind: "owner",
      name: o.name,
      href: KIND_META.owner.href(o.name),
      hint: String(o.count),
    });
  }
  return items;
}

interface Group {
  kind: CatalogKind;
  items: PaletteItem[];
  startIndex: number;
}

function groupItems(items: PaletteItem[]): Group[] {
  const byKind = new Map<CatalogKind, PaletteItem[]>();
  for (const item of items) {
    const list = byKind.get(item.kind) ?? [];
    list.push(item);
    byKind.set(item.kind, list);
  }
  const groups: Group[] = [];
  let cursor = 0;
  for (const kind of GROUP_ORDER) {
    const list = byKind.get(kind);
    if (!list || list.length === 0) continue;
    groups.push({ kind, items: list, startIndex: cursor });
    cursor += list.length;
  }
  return groups;
}

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl p-0">
        <DialogTitle className="sr-only">Catalog search</DialogTitle>
        <DialogDescription className="sr-only">
          Type to search featuresets, datasets, pipelines, sources, tags, and
          owners. Use arrow keys to navigate, Enter to open.
        </DialogDescription>
        {open ? <CommandPaletteBody onClose={() => setOpen(false)} /> : null}
      </DialogContent>
    </Dialog>
  );
}

interface BodyProps {
  onClose: () => void;
}

function CommandPaletteBody({ onClose }: BodyProps) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data, isLoading } = useSearch({ q, limit: 5 });
  const items = useMemo(() => (data ? flatten(data) : []), [data]);
  const groups = useMemo(() => groupItems(items), [items]);

  useEffect(() => {
    if (selectedIndex >= items.length && items.length > 0) {
      setSelectedIndex(0);
    }
  }, [items.length, selectedIndex]);

  const navigate = (item: PaletteItem) => {
    onClose();
    router.push(item.href);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = items[selectedIndex];
      if (item) navigate(item);
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
          <div className="flex items-center gap-2 border-b border-border/40 px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search catalog…"
              className="h-12 border-none focus-visible:border-none focus-visible:ring-0"
              autoFocus
            />
          </div>
          <div className="max-h-96 overflow-y-auto p-1">
            {isLoading && items.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Searching…
              </p>
            ) : items.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                {q.trim()
                  ? `No matches for "${q}"`
                  : "Start typing to search."}
              </p>
            ) : (
              groups.map((group) => (
                <div key={group.kind} className="py-1">
                  <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {KIND_META[group.kind].pluralLabel}
                  </div>
                  {group.items.map((item, j) => {
                    const flatIdx = group.startIndex + j;
                    const isSelected = flatIdx === selectedIndex;
                    return (
                      <button
                        key={`${item.kind}:${item.name}`}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => navigate(item)}
                        onMouseEnter={() => setSelectedIndex(flatIdx)}
                        className={cn(
                          "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none transition-colors",
                          isSelected ? "bg-accent" : "hover:bg-accent/60",
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <KindIcon kind={item.kind} />
                          <span className="truncate">{item.name}</span>
                        </span>
                        {item.hint ? (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {item.hint}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
          <div className="flex items-center gap-3 border-t border-border/40 px-3 py-2 text-[11px] text-muted-foreground">
            <KbdHint label="↑↓" text="navigate" />
            <KbdHint label="↵" text="select" />
            <KbdHint label="esc" text="close" />
          </div>
    </div>
  );
}

function KbdHint({ label, text }: { label: string; text: string }) {
  return (
    <span className="flex items-center gap-1">
      <kbd className="rounded border border-border/60 bg-muted px-1 py-0.5 font-mono text-[10px]">
        {label}
      </kbd>
      <span>{text}</span>
    </span>
  );
}
