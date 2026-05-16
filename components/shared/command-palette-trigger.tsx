"use client";

import { Search } from "lucide-react";
import { useCommandPalette } from "@/lib/hooks/use-command-palette";

export function CommandPaletteTrigger() {
  const { setOpen } = useCommandPalette();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex w-full items-center gap-2 rounded-md border border-border/60 bg-background/50 px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
      aria-label="Open command palette"
    >
      <Search className="size-3.5 shrink-0" />
      <span className="flex-1 text-left">Search…</span>
      <kbd className="rounded border border-border/60 bg-muted px-1 py-0.5 font-mono text-[10px]">
        ⌘K
      </kbd>
    </button>
  );
}
