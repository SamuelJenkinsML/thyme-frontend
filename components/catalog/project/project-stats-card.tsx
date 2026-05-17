import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ProjectDetail } from "@/lib/types";

interface ProjectStatsCardProps {
  project: ProjectDetail;
}

const freshnessStyle: Record<"fresh" | "stale" | "broken", string> = {
  fresh: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  stale: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  broken: "border-red-500/20 bg-red-500/10 text-red-400",
};

export function ProjectStatsCard({ project }: ProjectStatsCardProps) {
  const total =
    project.members.featuresets.length +
    project.members.datasets.length +
    project.members.sources.length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCell label="Members" value={total} />
          <StatCell label="Featuresets" value={project.members.featuresets.length} />
          <StatCell label="Datasets" value={project.members.datasets.length} />
          <StatCell label="Sources" value={project.members.sources.length} />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Freshness
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(["fresh", "stale", "broken"] as const).map((bucket) => (
              <Badge
                key={bucket}
                variant="secondary"
                className={`text-[11px] border ${freshnessStyle[bucket]}`}
              >
                {project.freshness[bucket]} {bucket}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border/50 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
