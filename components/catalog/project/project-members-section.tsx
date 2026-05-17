import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Database, Sparkles, Plug } from "lucide-react";
import { FeaturesetsTab } from "@/components/catalog/featuresets-tab";
import { DatasetsTab } from "@/components/catalog/datasets-tab";
import { KIND_COLORS } from "@/lib/catalog/kind-colors";
import type { ProjectMembers } from "@/lib/types";

interface ProjectMembersSectionProps {
  members: ProjectMembers;
}

export function ProjectMembersSection({ members }: ProjectMembersSectionProps) {
  return (
    <section className="space-y-6">
      <SubSection
        icon={Sparkles}
        kind="featureset"
        title="Featuresets"
        count={members.featuresets.length}
      >
        {members.featuresets.length > 0 ? (
          <FeaturesetsTab data={members.featuresets} isLoading={false} />
        ) : (
          <EmptyHint label="No featuresets in this project yet." />
        )}
      </SubSection>

      <SubSection
        icon={Database}
        kind="dataset"
        title="Datasets"
        count={members.datasets.length}
      >
        {members.datasets.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {members.datasets.map((ds) => (
              <Link
                key={ds.id}
                href={`/catalog/datasets/${encodeURIComponent(ds.name)}`}
              >
                <Card
                  className={`h-full transition-all hover:bg-accent/20 cursor-pointer border-l-2 ${KIND_COLORS.dataset.border} ${KIND_COLORS.dataset.hoverGlow}`}
                >
                  <CardContent className="flex items-center justify-between gap-3 p-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded ${KIND_COLORS.dataset.iconBg}`}
                      >
                        <Database
                          className={`size-3 ${KIND_COLORS.dataset.iconFg}`}
                        />
                      </span>
                      <span className="truncate font-medium">{ds.name}</span>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      v{ds.version}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyHint label="No datasets in this project yet." />
        )}
      </SubSection>

      <SubSection
        icon={Plug}
        kind="source"
        title="Sources"
        count={members.sources.length}
      >
        {members.sources.length > 0 ? (
          <DatasetsTab data={members.sources} jobs={[]} isLoading={false} />
        ) : (
          <EmptyHint label="No sources in this project yet." />
        )}
      </SubSection>
    </section>
  );
}

function SubSection({
  icon: Icon,
  kind,
  title,
  count,
  children,
}: {
  icon: typeof Database;
  kind: "featureset" | "dataset" | "source";
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  const colors = KIND_COLORS[kind];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span
          className={`flex size-5 items-center justify-center rounded ${colors.iconBg}`}
        >
          <Icon className={`size-3 ${colors.iconFg}`} />
        </span>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h2>
        <span className="text-xs text-muted-foreground">({count})</span>
      </div>
      {children}
    </div>
  );
}

function EmptyHint({ label }: { label: string }) {
  return <p className="text-sm text-muted-foreground">{label}</p>;
}
