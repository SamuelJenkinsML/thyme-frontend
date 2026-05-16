"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { KIND_META } from "@/lib/catalog/kind-meta";

interface TagChipProps {
  tagKey: string;
  tagValue?: string;
  clickable?: boolean;
}

export function TagChip({ tagKey, tagValue, clickable = true }: TagChipProps) {
  const router = useRouter();
  const label = tagValue ? `${tagKey}:${tagValue}` : tagKey;
  const badge = (
    <Badge
      variant="outline"
      className="text-xs transition-colors hover:border-thyme-leaf/40 hover:text-thyme-leaf"
    >
      {label}
    </Badge>
  );

  if (!clickable) return badge;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        router.push(KIND_META.tag.href(tagKey));
      }}
      aria-label={`Browse entities tagged ${tagKey}`}
      className="cursor-pointer"
    >
      {badge}
    </button>
  );
}
