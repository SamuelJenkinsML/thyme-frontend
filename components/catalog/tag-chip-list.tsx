import { Badge } from "@/components/ui/badge";
import { TagChip } from "./tag-chip";

interface TagChipListProps {
  tags?: Record<string, string>;
  max?: number;
}

export function TagChipList({ tags, max = 3 }: TagChipListProps) {
  const entries = Object.entries(tags ?? {});
  if (entries.length === 0) return null;

  const shown = entries.slice(0, max);
  const overflow = entries.length - max;

  return (
    <>
      {shown.map(([key, value]) => (
        <TagChip key={key} tagKey={key} tagValue={value} />
      ))}
      {overflow > 0 && (
        <Badge variant="outline" className="text-xs">
          +{overflow} more
        </Badge>
      )}
    </>
  );
}
