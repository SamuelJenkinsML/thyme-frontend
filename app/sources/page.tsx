"use client";

import { useSources } from "@/lib/hooks/use-sources";
import { SourceCard } from "@/components/monitoring/source-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SourcesPage() {
  const { data, isLoading, error } = useSources();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Sources</h1>

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

      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-full">No sources found.</p>
          ) : (
            data.map((src) => <SourceCard key={src.id} source={src} />)
          )}
        </div>
      )}
    </div>
  );
}
