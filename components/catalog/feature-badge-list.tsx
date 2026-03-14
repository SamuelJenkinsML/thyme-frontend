import { Badge } from "@/components/ui/badge";

interface FeatureBadgeListProps {
  features: string[];
  max?: number;
}

export function FeatureBadgeList({ features, max = 5 }: FeatureBadgeListProps) {
  const shown = features.slice(0, max);
  const overflow = features.length - max;

  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((name) => (
        <Badge key={name} variant="secondary" className="font-mono text-xs">
          {name}
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge variant="outline" className="text-xs">
          +{overflow} more
        </Badge>
      )}
    </div>
  );
}
