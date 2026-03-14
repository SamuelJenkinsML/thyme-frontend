"use client";

import { useJobs } from "@/lib/hooks/use-jobs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function JobsTable() {
  const { data, isLoading, error } = useJobs(10_000);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">Failed to load jobs: {error.message}</p>;
  }

  if (!data?.length) {
    return <p className="text-sm text-muted-foreground">No jobs found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Input Topic</TableHead>
          <TableHead>Output Topic</TableHead>
          <TableHead className="text-right">Partitions</TableHead>
          <TableHead>Disorder</TableHead>
          <TableHead className="text-right">Operators</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((job) => {
          const spec = job.spec;
          const operators = spec.pipeline_spec?.operators ?? [];
          return (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.name}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {spec.input_topic}
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {spec.output_topic}
              </TableCell>
              <TableCell className="text-right">{job.partition_count}</TableCell>
              <TableCell>
                {spec.pipeline_spec?.disorder ? (
                  <Badge variant="outline">{spec.pipeline_spec.disorder}</Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">{operators.length}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
