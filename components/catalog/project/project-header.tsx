import { FolderOpen } from "lucide-react";
import { OwnerChip } from "@/components/catalog/owner-chip";
import { KIND_COLORS } from "@/lib/catalog/kind-colors";
import type { ProjectDetail } from "@/lib/types";

interface ProjectHeaderProps {
  project: ProjectDetail;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const colors = KIND_COLORS.project;
  const memberTotal =
    project.members.featuresets.length +
    project.members.datasets.length +
    project.members.sources.length;

  return (
    <header className="flex items-start gap-3">
      <span
        className={`mt-1 flex size-8 shrink-0 items-center justify-center rounded ${colors.iconBg}`}
      >
        <FolderOpen className={`size-4 ${colors.iconFg}`} />
      </span>
      <div className="flex-1 space-y-1.5">
        <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
        {project.description && (
          <p className="text-sm text-muted-foreground">{project.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {project.owner && <OwnerChip owner={project.owner} />}
          <span className="text-xs text-muted-foreground">
            {memberTotal} {memberTotal === 1 ? "member" : "members"}
          </span>
        </div>
      </div>
    </header>
  );
}
