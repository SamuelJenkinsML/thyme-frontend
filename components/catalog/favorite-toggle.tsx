"use client";

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/hooks/use-favorites";
import type { EntityKind } from "@/lib/catalog/local-store";
import { cn } from "@/lib/utils";

interface FavoriteToggleProps {
  kind: EntityKind;
  name: string;
  size?: "sm" | "md";
}

// Renders nothing pre-hydration so SSR and the first client render agree.
export function FavoriteToggle({ kind, name, size = "sm" }: FavoriteToggleProps) {
  const { favorites, toggle, isFavorite } = useFavorites();
  if (favorites === null) return null;
  const active = isFavorite(kind, name);
  const iconSize = size === "md" ? "size-4" : "size-3.5";
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => toggle(kind, name)}
      aria-pressed={active}
      aria-label={active ? `Unfavorite ${name}` : `Favorite ${name}`}
      title={active ? "Remove from favorites" : "Add to favorites"}
      className="h-7 w-7"
    >
      <Star
        className={cn(
          iconSize,
          active
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground hover:text-foreground",
        )}
      />
    </Button>
  );
}
