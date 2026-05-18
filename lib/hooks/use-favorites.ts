"use client";

import { useCallback, useEffect, useState } from "react";
import {
  FAVORITES_KEY,
  isSameEntity,
  readFavorites,
  writeFavorites,
  type EntityKind,
  type FavoriteItem,
} from "@/lib/catalog/local-store";

interface UseFavoritesResult {
  favorites: FavoriteItem[] | null; // null = pre-hydration, render nothing
  toggle: (kind: EntityKind, name: string) => void;
  isFavorite: (kind: EntityKind, name: string) => boolean;
}

// SSR-safe localStorage hook. Returns `null` until the first effect tick so
// the server-rendered HTML (also empty) matches the first client render.
export function useFavorites(): UseFavoritesResult {
  const [items, setItems] = useState<FavoriteItem[] | null>(null);

  useEffect(() => {
    setItems(readFavorites());

    // Cross-tab sync — pick up changes made in another browser tab.
    const onStorage = (e: StorageEvent) => {
      if (e.key === FAVORITES_KEY) setItems(readFavorites());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (items === null) return;
    writeFavorites(items);
  }, [items]);

  const toggle = useCallback((kind: EntityKind, name: string) => {
    setItems((prev) => {
      const list = prev ?? [];
      const idx = list.findIndex((it) => isSameEntity(it, { kind, name }));
      if (idx >= 0) {
        return list.filter((_, i) => i !== idx);
      }
      return [{ kind, name, addedAt: new Date().toISOString() }, ...list];
    });
  }, []);

  const isFavorite = useCallback(
    (kind: EntityKind, name: string): boolean => {
      if (items === null) return false;
      return items.some((it) => isSameEntity(it, { kind, name }));
    },
    [items],
  );

  return { favorites: items, toggle, isFavorite };
}
