"use client";

import { useJobs } from "@/lib/hooks/use-jobs";
import { JobsTable } from "@/components/monitoring/jobs-table";
import { DocsLink } from "@/components/shared/docs-link";
import { TermTooltip } from "@/components/shared/term-tooltip";

export default function JobsPage() {
  const { dataUpdatedAt } = useJobs(10_000);

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
          <TermTooltip term="pipeline" />
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Last updated: {lastUpdated} · auto-refreshes every 10s
            </p>
          )}
          <DocsLink href="/docs/operations/scaling" className="text-xs">
            Tuning throughput
          </DocsLink>
        </div>
      </div>
      <JobsTable />
    </div>
  );
}
