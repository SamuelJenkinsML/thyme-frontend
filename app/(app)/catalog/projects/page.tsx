import { fetchProjects } from "@/lib/api/definition";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProjectCard } from "@/components/catalog/project/project-card";

export default async function ProjectsIndexPage() {
  const projects = await fetchProjects();

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[{ label: "Catalog", href: "/catalog" }, { label: "Projects" }]}
      />
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-sm text-muted-foreground">
          Soft grouping for featuresets, datasets, and sources. {projects.length}{" "}
          {projects.length === 1 ? "project" : "projects"}.
        </p>
      </header>
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No projects defined yet. Add{" "}
          <code className="rounded bg-muted px-1 py-0.5">project=&quot;name&quot;</code>{" "}
          to a featureset, dataset, or source in your SDK definitions.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
