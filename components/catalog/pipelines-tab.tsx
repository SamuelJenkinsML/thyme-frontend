"use client";

import Link from "next/link";
import { useJobs } from "@/lib/hooks/use-jobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";

export function PipelinesTab() {
  const { data, isLoading, error } = useJobs();

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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((job) => {
        const spec = job.spec;
        const pipelineName = job.name.replace(/_job$/, "");
        const operators = spec.pipeline_spec?.operators ?? [];
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
                <div className="flex gap-1">
                  {operators.length > 0 && (
                    <Badge variant="outline">{operators.length} operators</Badge>
                  )}
                  {spec.pipeline_spec?.disorder && (
                    <Badge variant="outline">disorder {spec.pipeline_spec.disorder}</Badge>
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
