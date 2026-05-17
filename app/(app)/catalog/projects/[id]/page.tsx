import { notFound } from "next/navigation";
import { fetchProject } from "@/lib/api/definition";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProjectHeader } from "@/components/catalog/project/project-header";
import { ProjectStatsCard } from "@/components/catalog/project/project-stats-card";
import { ProjectMembersSection } from "@/components/catalog/project/project-members-section";
import { ProjectActivityFeed } from "@/components/catalog/project/project-activity-feed";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const decoded = decodeURIComponent(id);

  let project;
  try {
    project = await fetchProject(decoded);
  } catch {
    notFound();
  }
  if (!project) notFound();

  const memberNames = [
    ...project.members.featuresets.map((f) => f.name),
    ...project.members.datasets.map((d) => d.name),
    ...project.members.sources.map((s) => s.dataset),
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Catalog", href: "/catalog" },
          { label: "Projects", href: "/catalog/projects" },
          { label: project.name },
        ]}
      />
      <ProjectHeader project={project} />
      <ProjectStatsCard project={project} />
      <ProjectMembersSection members={project.members} />
      <ProjectActivityFeed memberNames={memberNames} />
    </div>
  );
}
