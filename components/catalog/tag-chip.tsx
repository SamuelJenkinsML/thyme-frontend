import { Badge } from "@/components/ui/badge";

interface TagChipProps {
  tagKey: string;
  tagValue?: string;
}

export function TagChip({ tagKey, tagValue }: TagChipProps) {
  const label = tagValue ? `${tagKey}:${tagValue}` : tagKey;
  return (
    <Badge
      variant="outline"
      className="text-xs transition-colors hover:border-thyme-leaf/40 hover:text-thyme-leaf"
    >
      {label}
    </Badge>
  );
}
