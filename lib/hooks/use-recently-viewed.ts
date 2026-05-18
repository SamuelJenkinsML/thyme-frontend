"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isSameEntity,
  readRecentlyViewed,
  RECENTLY_VIEWED_CAP,
  RECENTLY_VIEWED_KEY,
  writeRecentlyViewed,
  type EntityKind,
  type RecentlyViewedItem,
} from "@/lib/catalog/local-store";

interface UseRecentlyViewedResult {
  recent: RecentlyViewedItem[] | null; // null = pre-hydration
  record: (kind: EntityKind, name: string) => void;
}

// LRU: re-recording an entity bumps it to the front; tail is dropped past CAP.
export function useRecentlyViewed(): UseRecentlyViewedResult {
  const [items, setItems] = useState<RecentlyViewedItem[] | null>(null);

  useEffect(() => {
    setItems(readRecentlyViewed());

    const onStorage = (e: StorageEvent) => {
      if (e.key === RECENTLY_VIEWED_KEY) setItems(readRecentlyViewed());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (items === null) return;
    writeRecentlyViewed(items);
  }, [items]);

  const record = useCallback((kind: EntityKind, name: string) => {
    setItems((prev) => {
      const list = prev ?? [];
      const without = list.filter((it) => !isSameEntity(it, { kind, name }));
      return [
        { kind, name, viewedAt: new Date().toISOString() },
        ...without,
      ].slice(0, RECENTLY_VIEWED_CAP);
    });
  }, []);

  return { recent: items, record };
}
