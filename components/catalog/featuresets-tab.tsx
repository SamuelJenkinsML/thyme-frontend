"use client";

import Link from "next/link";
import { useFeaturesets } from "@/lib/hooks/use-featuresets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FeatureBadgeList } from "./feature-badge-list";

export function FeaturesetsTab() {
  const { data, isLoading, error } = useFeaturesets();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">Failed to load featuresets: {error.message}</p>;
  }

  if (!data?.length) {
    return <p className="text-sm text-muted-foreground">No featuresets found. Run `thyme commit` to register definitions.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((fs) => (
        <Link key={fs.id} href={`/catalog/featuresets/${encodeURIComponent(fs.name)}`}>
          <Card className="h-full transition-colors hover:bg-accent/20 cursor-pointer">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-semibold">{fs.name}</CardTitle>
                <div className="flex gap-1 shrink-0">
                  <Badge variant="secondary">{fs.spec.features?.length ?? 0} features</Badge>
                  {(fs.spec.extractors?.length ?? 0) > 0 && (
                    <Badge variant="outline">{fs.spec.extractors.length} extractors</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <FeatureBadgeList features={(fs.spec.features ?? []).map((f) => f.name)} />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
