"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FeatureBadgeList } from "./feature-badge-list";
import { FreshnessPill } from "./freshness-pill";
import { OwnerChip } from "./owner-chip";
import { TagChipList } from "./tag-chip-list";
import { KIND_COLORS } from "@/lib/catalog/kind-colors";
import { Sparkles } from "lucide-react";
import type { FeaturesetRecord } from "@/lib/types";

interface FeaturesetsTabProps {
  data: FeaturesetRecord[];
  isLoading: boolean;
  searchTerm?: string;
}

export function FeaturesetsTab({ data, isLoading, searchTerm = "" }: FeaturesetsTabProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    if (searchTerm.trim()) {
      return <p className="text-sm text-muted-foreground">No featuresets matching &ldquo;{searchTerm}&rdquo;.</p>;
    }
    return <p className="text-sm text-muted-foreground">No featuresets found. Run `thyme commit` to register definitions.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((fs) => {
        const features = fs.spec.features ?? [];
        const dtypeCounts: Record<string, number> = {};
        features.forEach((f) => {
          dtypeCounts[f.dtype] = (dtypeCounts[f.dtype] ?? 0) + 1;
        });
        const topDtypes = Object.entries(dtypeCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3);

        const isDeprecated = Boolean(
          fs.metadata?.deprecated_at || fs.metadata?.deprecated,
        );
        return (
          <Link key={fs.id} href={`/catalog/featuresets/${encodeURIComponent(fs.name)}`}>
            <Card
              className={`h-full transition-all hover:bg-accent/20 cursor-pointer border-l-2 ${KIND_COLORS.featureset.border} ${KIND_COLORS.featureset.hoverGlow} ${isDeprecated ? "opacity-70" : ""}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded ${KIND_COLORS.featureset.iconBg}`}
                    >
                      <Sparkles className={`size-3 ${KIND_COLORS.featureset.iconFg}`} />
                    </span>
                    <span className={`truncate ${isDeprecated ? "line-through decoration-yellow-400/60" : ""}`}>
                      {fs.name}
                    </span>
                  </CardTitle>
                  <div className="flex gap-1 shrink-0">
                    {isDeprecated && (
                      <Badge
                        variant="outline"
                        className="border-yellow-500/40 bg-yellow-500/10 text-yellow-300"
                      >
                        Deprecated
                      </Badge>
                    )}
                    <FreshnessPill updatedAt={fs.metadata?.updated_at} />
                    <Badge variant="secondary">{features.length} features</Badge>
                    {(fs.spec.extractors?.length ?? 0) > 0 && (
                      <Badge variant="outline">{fs.spec.extractors.length} extractors</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <FeatureBadgeList features={features.map((f) => f.name)} />
                {topDtypes.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {topDtypes.map(([dtype, count]) => (
                      <Badge key={dtype} variant="ghost" className="text-[10px] h-4">
                        {dtype} ({count})
                      </Badge>
                    ))}
                  </div>
                )}
                {(fs.metadata?.owner || Object.keys(fs.metadata?.tags ?? {}).length > 0) && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-border/40">
                    <OwnerChip owner={fs.metadata?.owner} />
                    <TagChipList tags={fs.metadata?.tags} />
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
