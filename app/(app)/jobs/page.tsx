"use client";

import { useJobs } from "@/lib/hooks/use-jobs";
import { JobsTable } from "@/components/monitoring/jobs-table";

export default function JobsPage() {
  const { dataUpdatedAt } = useJobs(10_000);

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Jobs</h1>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated} · auto-refreshes every 10s
          </p>
        )}
      </div>
      <JobsTable />
    </div>
  );
}
