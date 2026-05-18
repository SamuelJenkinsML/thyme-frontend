// Catalog localStorage — TH-CAT-F1 (favorites + recently-viewed).
//
// Single source of truth for keys, schema version, and safe read/write so the
// hooks and tests don't need to redo JSON parsing or version handshakes.

export type EntityKind = "featureset" | "dataset" | "pipeline";

export interface FavoriteItem {
  kind: EntityKind;
  name: string;
  addedAt: string; // ISO timestamp
}

export interface RecentlyViewedItem {
  kind: EntityKind;
  name: string;
  viewedAt: string; // ISO timestamp
}

const SCHEMA_VERSION = 1;
export const FAVORITES_KEY = "thyme:catalog:favorites";
export const RECENTLY_VIEWED_KEY = "thyme:catalog:recently-viewed";
export const RECENTLY_VIEWED_CAP = 8;

interface Stored<T> {
  version: number;
  items: T[];
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function safeRead<T>(key: string): T[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Stored<T>;
    if (!parsed || parsed.version !== SCHEMA_VERSION || !Array.isArray(parsed.items)) {
      return [];
    }
    return parsed.items;
  } catch {
    // Corrupt JSON or quota error — reset to empty.
    return [];
  }
}

function safeWrite<T>(key: string, items: T[]): void {
  if (!isBrowser()) return;
  try {
    const payload: Stored<T> = { version: SCHEMA_VERSION, items };
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Quota or private-mode error — swallow silently.
  }
}

export function readFavorites(): FavoriteItem[] {
  return safeRead<FavoriteItem>(FAVORITES_KEY);
}

export function writeFavorites(items: FavoriteItem[]): void {
  safeWrite(FAVORITES_KEY, items);
}

export function readRecentlyViewed(): RecentlyViewedItem[] {
  return safeRead<RecentlyViewedItem>(RECENTLY_VIEWED_KEY);
}

export function writeRecentlyViewed(items: RecentlyViewedItem[]): void {
  safeWrite(RECENTLY_VIEWED_KEY, items);
}

export function isSameEntity(
  a: { kind: EntityKind; name: string },
  b: { kind: EntityKind; name: string },
): boolean {
  return a.kind === b.kind && a.name === b.name;
}
