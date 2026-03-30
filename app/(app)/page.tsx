"use client";

import { useFeaturesets } from "@/lib/hooks/use-featuresets";
import { useJobs } from "@/lib/hooks/use-jobs";
import { useSources } from "@/lib/hooks/use-sources";
import { StatCard } from "@/components/dashboard/stat-card";
import { SystemHealth } from "@/components/dashboard/system-health";
import { EventsFeed } from "@/components/dashboard/events-feed";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Layers, Activity, Database } from "lucide-react";

export default function DashboardPage() {
  const { data: featuresets, isLoading: fsLoading } = useFeaturesets();
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const { data: sources, isLoading: srcLoading } = useSources();

  const isLoading = fsLoading || jobsLoading || srcLoading;

  const totalFeatures = (featuresets ?? []).reduce(
    (sum, fs) => sum + (fs.spec.features?.length ?? 0),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">System overview for your streaming feature platform.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Featuresets"
            value={featuresets?.length ?? 0}
            subtitle={`${totalFeatures} total features`}
            icon={BookOpen}
            href="/catalog"
          />
          <StatCard
            label="Total Features"
            value={totalFeatures}
            icon={Layers}
            href="/catalog"
          />
          <StatCard
            label="Active Jobs"
            value={jobs?.length ?? 0}
            icon={Activity}
            href="/jobs"
          />
          <StatCard
            label="Sources"
            value={sources?.length ?? 0}
            icon={Database}
            href="/sources"
          />
        </div>
      )}

      <div className="max-w-md">
        <SystemHealth />
      </div>

      <EventsFeed />
    </div>
  );
}
