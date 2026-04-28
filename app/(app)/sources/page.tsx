"use client";

import { useSources } from "@/lib/hooks/use-sources";
import { SourceCard } from "@/components/monitoring/source-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DocsLink } from "@/components/shared/docs-link";
import { TermTooltip } from "@/components/shared/term-tooltip";
import { Plug } from "lucide-react";
import { useMemo } from "react";

export default function SourcesPage() {
  const { data, isLoading, error } = useSources();

  const connectorBreakdown = useMemo(() => {
    if (!data) return {};
    const counts: Record<string, number> = {};
    data.forEach((s) => {
      counts[s.connector_type] = (counts[s.connector_type] ?? 0) + 1;
    });
    return counts;
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Sources</h1>
        <TermTooltip term="source" />
      </div>

      {data && data.length > 0 && (
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">{data.length} source(s)</span>
          <span className="text-muted-foreground">&middot;</span>
          {Object.entries(connectorBreakdown).map(([type, count]) => (
            <Badge key={type} variant="outline">{type} ({count})</Badge>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">Failed to load sources: {error.message}</p>
      )}

      {data && data.length === 0 && (
        <EmptyState
          icon={Plug}
          title="No sources committed yet"
          description="Define a @source on a dataset and run thyme commit to start ingesting events."
          action={<DocsLink href="/docs/integrations">Browse all connectors</DocsLink>}
        />
      )}

      {data && data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((src) => <SourceCard key={src.id} source={src} />)}
        </div>
      )}
    </div>
  );
}
