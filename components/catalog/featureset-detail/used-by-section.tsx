"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDependents } from "@/lib/hooks/use-dependents";
import { KIND_COLORS } from "@/lib/catalog/kind-colors";
import type { DependentRecord } from "@/lib/types";

const KIND_ACCENT: Record<string, string> = {
  pipelines: KIND_COLORS.pipeline.accentText,
  featuresets: KIND_COLORS.featureset.accentText,
  datasets: KIND_COLORS.dataset.accentText,
  sources: KIND_COLORS.source.accentText,
};

function accentForKind(kind: string): string {
  return KIND_ACCENT[kind] ?? "text-muted-foreground";
}

interface UsedBySectionProps {
  featuresetName: string;
}

const KIND_LABELS: Record<string, string> = {
  pipelines: "Pipelines",
  featuresets: "Featuresets",
  datasets: "Datasets",
  sources: "Sources",
};

function pluralKindLabel(kind: string): string {
  return KIND_LABELS[kind] ?? kind;
}

function groupByKind(dependents: DependentRecord[]): Record<string, DependentRecord[]> {
  const groups: Record<string, DependentRecord[]> = {};
  for (const dep of dependents) {
    (groups[dep.kind] ??= []).push(dep);
  }
  return groups;
}

export function UsedBySection({ featuresetName }: UsedBySectionProps) {
  const { data, isLoading, error } = useDependents("featuresets", featuresetName);

  return (
    <section id="used-by" className="scroll-mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Used by</CardTitle>
          <CardDescription>
            Pipelines and featuresets that consume this featureset.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-64" />
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">
              Failed to load consumers: {error.message}
            </p>
          ) : !data || data.dependents.length === 0 ? (
            <p className="text-sm italic text-muted-foreground">
              Nothing consumes this featureset.
            </p>
          ) : (
            <UsedByList dependents={data.dependents} />
          )}
        </CardContent>
      </Card>
    </section>
  );
}

interface UsedByListProps {
  dependents: DependentRecord[];
}

function UsedByList({ dependents }: UsedByListProps) {
  const groups = groupByKind(dependents);
  const kinds = Object.keys(groups).sort();

  return (
    <div className="space-y-4">
      {kinds.map((kind) => (
        <div key={kind} className="space-y-2">
          <h3 className={`text-xs uppercase tracking-wide ${accentForKind(kind)}`}>
            {pluralKindLabel(kind)} ({groups[kind].length})
          </h3>
          <ul className="space-y-1">
            {groups[kind].map((dep) => (
              <li
                key={`${dep.kind}/${dep.name}/${dep.edge_type}`}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <Link
                  href={`/catalog/${dep.kind}/${encodeURIComponent(dep.name)}`}
                  className="font-mono hover:text-foreground hover:underline"
                >
                  {dep.name}
                </Link>
                <Badge variant="ghost" className="text-[10px]">
                  {dep.edge_type}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
