import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FRESHNESS_LABEL,
  FRESHNESS_STYLE,
  type FreshnessBucket,
} from "@/lib/catalog/freshness";
import { computeOwnerHealth } from "@/lib/catalog/owner-health";
import type { SearchResponse } from "@/lib/types";

interface OwnershipHealthPanelProps {
  data: SearchResponse;
}

const FRESHNESS_ORDER: FreshnessBucket[] = ["fresh", "stale", "broken", "unknown"];

export function OwnershipHealthPanel({ data }: OwnershipHealthPanelProps) {
  const health = computeOwnerHealth(data);

  // No metadata-bearing entities → don't render an empty card.
  if (health.total === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Ownership health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Freshness
          </p>
          <div className="flex flex-wrap gap-1.5">
            {FRESHNESS_ORDER.map((bucket) => (
              <Badge
                key={bucket}
                variant="secondary"
                className={`text-[11px] border ${FRESHNESS_STYLE[bucket]}`}
              >
                {health.freshness[bucket]} {FRESHNESS_LABEL[bucket].toLowerCase()}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 border-t border-border/40 pt-3 text-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Documentation
          </p>
          <ul className="space-y-1 text-sm">
            <li>
              <span className="font-mono tabular-nums">
                {health.documentation.hasDescription} / {health.total}
              </span>{" "}
              <span className="text-muted-foreground">have descriptions</span>
            </li>
            <li>
              <span className="font-mono tabular-nums">
                {health.documentation.hasTags} / {health.total}
              </span>{" "}
              <span className="text-muted-foreground">are tagged</span>
            </li>
            <li
              className={
                health.documentation.undocumented > 0
                  ? "text-red-300"
                  : "text-muted-foreground"
              }
            >
              <span className="font-mono tabular-nums">
                {health.documentation.undocumented}
              </span>{" "}
              undocumented (no description and no tags)
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
