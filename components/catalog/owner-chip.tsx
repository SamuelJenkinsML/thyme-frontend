"use client";

import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { KIND_META } from "@/lib/catalog/kind-meta";

interface OwnerChipProps {
  owner?: string | null;
  clickable?: boolean;
}

export function OwnerChip({ owner, clickable = true }: OwnerChipProps) {
  const router = useRouter();
  if (!owner) return null;
  const badge = (
    <Badge
      variant="secondary"
      className="border border-thyme-leaf/20 bg-thyme-leaf/10 text-thyme-leaf text-xs"
    >
      <User />
      {owner}
    </Badge>
  );

  if (!clickable) return badge;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        router.push(KIND_META.owner.href(owner));
      }}
      aria-label={`Browse entities owned by ${owner}`}
      className="cursor-pointer"
    >
      {badge}
    </button>
  );
}
