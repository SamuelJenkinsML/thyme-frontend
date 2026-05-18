"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/lib/hooks/use-recently-viewed";
import type { EntityKind } from "@/lib/catalog/local-store";

interface RecordRecentlyViewedProps {
  kind: EntityKind;
  name: string;
}

// Tiny client island dropped into each detail page. Calls `record` once on
// mount per (kind, name). Renders nothing.
export function RecordRecentlyViewed({ kind, name }: RecordRecentlyViewedProps) {
  const { record } = useRecentlyViewed();
  useEffect(() => {
    record(kind, name);
  }, [kind, name, record]);
  return null;
}
