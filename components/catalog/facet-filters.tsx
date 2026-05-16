"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useOwners } from "@/lib/hooks/use-owners";
import { useTags } from "@/lib/hooks/use-tags";
import { FacetMultiselect } from "./facet-multiselect";

interface FacetFiltersProps {
  tags: string[];
  owners: string[];
  onTagsChange: (next: string[]) => void;
  onOwnersChange: (next: string[]) => void;
}

export function FacetFilters({
  tags,
  owners,
  onTagsChange,
  onOwnersChange,
}: FacetFiltersProps) {
  const tagsQuery = useTags();
  const ownersQuery = useOwners();

  const hasActive = tags.length > 0 || owners.length > 0;

  const clearAll = () => {
    onTagsChange([]);
    onOwnersChange([]);
  };

  return (
    <div
      className="flex flex-wrap items-center gap-2"
      data-slot="facet-filters"
      aria-label="Catalog filters"
    >
      <FacetMultiselect
        label="Tags"
        options={tagsQuery.data ?? []}
        selected={tags}
        onChange={onTagsChange}
        isLoading={tagsQuery.isLoading}
        emptyText="No tags registered yet."
      />
      <FacetMultiselect
        label="Owners"
        options={ownersQuery.data ?? []}
        selected={owners}
        onChange={onOwnersChange}
        isLoading={ownersQuery.isLoading}
        emptyText="No owners registered yet."
      />

      {hasActive ? (
        <div className="flex flex-wrap items-center gap-1">
          {tags.map((tag) => (
            <ActiveChip
              key={`tag-${tag}`}
              label={`tag: ${tag}`}
              onRemove={() => onTagsChange(tags.filter((t) => t !== tag))}
            />
          ))}
          {owners.map((owner) => (
            <ActiveChip
              key={`owner-${owner}`}
              label={`owner: ${owner}`}
              onRemove={() =>
                onOwnersChange(owners.filter((o) => o !== owner))
              }
            />
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="ml-1 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  );
}

interface ActiveChipProps {
  label: string;
  onRemove: () => void;
}

function ActiveChip({ label, onRemove }: ActiveChipProps) {
  return (
    <Badge
      variant="secondary"
      className="gap-1 pr-1 pl-2 text-xs font-normal"
    >
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="rounded-sm p-0.5 transition-colors hover:bg-foreground/10"
      >
        <X className="size-3" />
      </button>
    </Badge>
  );
}
