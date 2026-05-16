"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Workflow } from "lucide-react";
import type { JobRecord, PipelineOperator } from "@/lib/types";
import { OwnerChip } from "./owner-chip";
import { TagChipList } from "./tag-chip-list";
import { KIND_COLORS } from "@/lib/catalog/kind-colors";

function getOperatorType(op: PipelineOperator): string {
  if ("aggregate" in op) return "Aggregate";
  if ("filter" in op) return "Filter";
  if ("transform" in op) return "Transform";
  if ("group_by" in op) return "GroupBy";
  const keys = Object.keys(op);
  return keys[0] ?? "Unknown";
}

interface PipelinesTabProps {
  data: JobRecord[];
  isLoading: boolean;
  searchTerm?: string;
}

export function PipelinesTab({ data, isLoading, searchTerm = "" }: PipelinesTabProps) {
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
      return <p className="text-sm text-muted-foreground">No pipelines matching &ldquo;{searchTerm}&rdquo;.</p>;
    }
    return <p className="text-sm text-muted-foreground">No pipelines found.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((job) => {
        const spec = job.spec;
        const pipelineName = job.name.replace(/_job$/, "");
        const operators = spec.pipeline_spec?.operators ?? [];
        const opTypes = [...new Set(operators.map(getOperatorType))];

        return (
          <Link key={job.id} href={`/catalog/pipelines/${encodeURIComponent(pipelineName)}`}>
            <Card
              className={`h-full transition-all hover:bg-accent/20 cursor-pointer border-l-2 ${KIND_COLORS.pipeline.border} ${KIND_COLORS.pipeline.hoverGlow}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded ${KIND_COLORS.pipeline.iconBg}`}
                    >
                      <Workflow className={`size-3 ${KIND_COLORS.pipeline.iconFg}`} />
                    </span>
                    <span className="truncate">{job.name}</span>
                  </CardTitle>
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
                {(job.metadata?.owner || Object.keys(job.metadata?.tags ?? {}).length > 0) && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-border/40">
                    <OwnerChip owner={job.metadata?.owner} />
                    <TagChipList tags={job.metadata?.tags} />
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
