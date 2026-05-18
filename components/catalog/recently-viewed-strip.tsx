"use client";

import Link from "next/link";
import { KindIcon } from "@/components/catalog/kind-icon";
import { KIND_META } from "@/lib/catalog/kind-meta";
import { useRecentlyViewed } from "@/lib/hooks/use-recently-viewed";

export function RecentlyViewedStrip() {
  const { recent } = useRecentlyViewed();
  if (recent === null || recent.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Recently viewed
      </p>
      <div className="flex flex-wrap gap-1.5">
        {recent.map((it) => (
          <Link
            key={`${it.kind}:${it.name}`}
            href={KIND_META[it.kind].href(it.name)}
            className="flex items-center gap-1.5 rounded-md border border-border/50 bg-card px-2 py-1 text-xs transition-colors hover:bg-accent/30"
          >
            <KindIcon kind={it.kind} className="size-4" iconClassName="size-2.5" />
            <span className="font-medium">{it.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
