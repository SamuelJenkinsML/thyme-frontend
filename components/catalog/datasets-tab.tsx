"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Database } from "lucide-react";
import { FreshnessPill } from "./freshness-pill";
import { OwnerChip } from "./owner-chip";
import { TagChipList } from "./tag-chip-list";
import { KIND_COLORS } from "@/lib/catalog/kind-colors";
import type { JobRecord, SourceRecord } from "@/lib/types";

interface DatasetsTabProps {
  data: SourceRecord[];
  jobs: JobRecord[];
  isLoading: boolean;
  searchTerm?: string;
}

export function DatasetsTab({ data, jobs, isLoading, searchTerm = "" }: DatasetsTabProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-lg" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    if (searchTerm.trim()) {
      return <p className="text-sm text-muted-foreground">No datasets matching &ldquo;{searchTerm}&rdquo;.</p>;
    }
    return <p className="text-sm text-muted-foreground">No datasets found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((src) => {
        const topic = `${src.dataset}_topic`;
        const consuming = jobs.filter((j) => j.spec.input_topic === topic);
        const isDeprecated = Boolean(
          src.metadata?.deprecated_at || src.metadata?.deprecated,
        );
        return (
          <Link key={src.id} href={`/catalog/datasets/${encodeURIComponent(src.dataset)}`}>
            <Card
              className={`h-full transition-all hover:bg-accent/20 cursor-pointer border-l-2 ${KIND_COLORS.dataset.border} ${KIND_COLORS.dataset.hoverGlow} ${isDeprecated ? "opacity-70" : ""}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded ${KIND_COLORS.dataset.iconBg}`}
                    >
                      <Database className={`size-3 ${KIND_COLORS.dataset.iconFg}`} />
                    </span>
                    <span className={`truncate ${isDeprecated ? "line-through decoration-yellow-400/60" : ""}`}>
                      {src.dataset}
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
                    <FreshnessPill updatedAt={src.metadata?.updated_at} />
                    <Badge variant="secondary">{src.connector_type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-muted-foreground font-mono">
                <p>{topic}</p>
                {consuming.length > 0 && (
                  <p className="text-xs text-foreground">{consuming.length} consuming job(s)</p>
                )}
                {(src.metadata?.owner || Object.keys(src.metadata?.tags ?? {}).length > 0) && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-border/40 font-sans">
                    <OwnerChip owner={src.metadata?.owner} />
                    <TagChipList tags={src.metadata?.tags} />
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
