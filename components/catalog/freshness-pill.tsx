import { Badge } from "@/components/ui/badge";
import {
  bucketFreshness,
  FRESHNESS_LABEL,
  FRESHNESS_STYLE,
  formatRelative,
  type FreshnessBucket,
} from "@/lib/catalog/freshness";

interface FreshnessPillProps {
  updatedAt?: string | null;
  bucket?: FreshnessBucket;
  size?: "sm" | "md";
}

// Server component — no client state. Renders nothing when bucket is `unknown`
// AND we have no `updatedAt` to show (i.e. an entity that has never been
// committed). Otherwise renders a coloured pill with the bucket label and a
// title-tooltip carrying the relative time.
export function FreshnessPill({ updatedAt, bucket, size = "sm" }: FreshnessPillProps) {
  const resolved: FreshnessBucket = bucket ?? bucketFreshness(updatedAt);
  if (resolved === "unknown" && !updatedAt) return null;

  const sizeClasses = size === "sm" ? "text-[10px]" : "text-xs";
  const tooltip = updatedAt ? `Updated ${formatRelative(updatedAt)}` : "No update timestamp";

  return (
    <Badge
      variant="secondary"
      className={`${sizeClasses} border ${FRESHNESS_STYLE[resolved]}`}
      title={tooltip}
    >
      {FRESHNESS_LABEL[resolved]}
    </Badge>
  );
}
