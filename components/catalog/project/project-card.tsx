import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen } from "lucide-react";
import { OwnerChip } from "@/components/catalog/owner-chip";
import { KIND_COLORS } from "@/lib/catalog/kind-colors";
import type { ProjectSummary } from "@/lib/types";

interface ProjectCardProps {
  project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const colors = KIND_COLORS.project;
  const total =
    project.member_count.featuresets +
    project.member_count.datasets +
    project.member_count.sources;

  return (
    <Link href={`/catalog/projects/${encodeURIComponent(project.id)}`}>
      <Card
        className={`h-full transition-all hover:bg-accent/20 cursor-pointer border-l-2 ${colors.border} ${colors.hoverGlow}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded ${colors.iconBg}`}
              >
                <FolderOpen className={`size-3 ${colors.iconFg}`} />
              </span>
              <span className="truncate">{project.name}</span>
            </CardTitle>
            <Badge variant="secondary" className="text-xs shrink-0">
              {total} {total === 1 ? "member" : "members"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {project.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {project.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {project.member_count.featuresets} featuresets ·{" "}
            {project.member_count.datasets} datasets ·{" "}
            {project.member_count.sources} sources
          </p>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {project.owner && <OwnerChip owner={project.owner} clickable={false} />}
            <FreshnessPills freshness={project.freshness} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function FreshnessPills({
  freshness,
}: {
  freshness: ProjectSummary["freshness"];
}) {
  const pills: { label: string; count: number; classes: string }[] = [
    {
      label: "fresh",
      count: freshness.fresh,
      classes: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    },
    {
      label: "stale",
      count: freshness.stale,
      classes: "border-amber-500/20 bg-amber-500/10 text-amber-400",
    },
    {
      label: "broken",
      count: freshness.broken,
      classes: "border-red-500/20 bg-red-500/10 text-red-400",
    },
  ];
  const visible = pills.filter((p) => p.count > 0);
  if (visible.length === 0) return null;
  return (
    <>
      {visible.map((p) => (
        <Badge
          key={p.label}
          variant="secondary"
          className={`text-[10px] border ${p.classes}`}
        >
          {p.count} {p.label}
        </Badge>
      ))}
    </>
  );
}
