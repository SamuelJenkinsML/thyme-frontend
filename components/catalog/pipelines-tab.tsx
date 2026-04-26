"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useJobs } from "@/lib/hooks/use-jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import type { PipelineOperator } from "@/lib/types";

function getOperatorType(op: PipelineOperator): string {
  if ("aggregate" in op) return "Aggregate";
  if ("filter" in op) return "Filter";
  if ("transform" in op) return "Transform";
  if ("group_by" in op) return "GroupBy";
  const keys = Object.keys(op);
  return keys[0] ?? "Unknown";
}

interface PipelinesTabProps {
  searchTerm?: string;
}

export function PipelinesTab({ searchTerm = "" }: PipelinesTabProps) {
  const { data, isLoading, error } = useJobs();

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((job) => job.name.toLowerCase().includes(term));
  }, [data, searchTerm]);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">Failed to load pipelines: {error.message}</p>;
  }

  if (!data?.length) {
    return <p className="text-sm text-muted-foreground">No pipelines found.</p>;
  }

  if (filtered.length === 0) {
    return <p className="text-sm text-muted-foreground">No pipelines matching &ldquo;{searchTerm}&rdquo;.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((job) => {
        const spec = job.spec;
        const pipelineName = job.name.replace(/_job$/, "");
        const operators = spec.pipeline_spec?.operators ?? [];
        const opTypes = [...new Set(operators.map(getOperatorType))];

        return (
          <Link key={job.id} href={`/catalog/pipelines/${encodeURIComponent(pipelineName)}`}>
            <Card className="h-full transition-colors hover:bg-accent/20 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold">{job.name}</CardTitle>
                  <Badge variant="secondary">{job.partition_count} partitions</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <span className="truncate">{spec.input_topic}</span>
                  <ArrowRight className="h-3 w-3 shrink-0" />
                  <span className="truncate">{spec.output_topic}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {opTypes.map((type) => (
                    <Badge key={type} variant="outline">{type}</Badge>
                  ))}
                  {operators.length > 0 && (
                    <Badge variant="ghost" className="text-[10px]">{operators.length} ops</Badge>
                  )}
                  {spec.pipeline_spec?.max_lateness && (
                    <Badge variant="outline">max_lateness {spec.pipeline_spec.max_lateness}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
