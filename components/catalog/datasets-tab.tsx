"use client";

import { useSources } from "@/lib/hooks/use-sources";
import { useJobs } from "@/lib/hooks/use-jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export function DatasetsTab() {
  const { data: sources, isLoading: srcLoading, error: srcError } = useSources();
  const { data: jobs } = useJobs();

  if (srcLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-lg" />
        ))}
      </div>
    );
  }

  if (srcError) {
    return <p className="text-sm text-destructive">Failed to load datasets: {srcError.message}</p>;
  }

  if (!sources?.length) {
    return <p className="text-sm text-muted-foreground">No datasets found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sources.map((src) => {
        const topic = `${src.dataset}_topic`;
        const consuming = (jobs ?? []).filter(
          (j) => j.spec.input_topic === topic
        );
        return (
          <Link key={src.id} href={`/catalog/datasets/${encodeURIComponent(src.dataset)}`}>
            <Card className="h-full transition-colors hover:bg-accent/20 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold">{src.dataset}</CardTitle>
                  <Badge variant="secondary">{src.connector_type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-muted-foreground font-mono">
                <p>{topic}</p>
                {consuming.length > 0 && (
                  <p className="text-xs text-foreground">{consuming.length} consuming job(s)</p>
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
