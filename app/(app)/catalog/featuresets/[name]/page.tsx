import { notFound } from "next/navigation";
import { fetchFeaturesets } from "@/lib/api/definition";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ActivitySection } from "@/components/catalog/featureset-detail/activity-section";
import { ExamplesSection } from "@/components/catalog/featureset-detail/examples-section";
import { ExtractorsSection } from "@/components/catalog/featureset-detail/extractors-section";
import { FeaturesetDetailHeader } from "@/components/catalog/featureset-detail/header";
import { HeaderActions } from "@/components/catalog/featureset-detail/header-actions";
import { LineageSection } from "@/components/catalog/featureset-detail/lineage-section";
import { OverviewSection } from "@/components/catalog/featureset-detail/overview-section";
import { RecentQueriesSection } from "@/components/catalog/featureset-detail/recent-queries-section";
import { SchemaSection } from "@/components/catalog/featureset-detail/schema-section";
import { SectionNav } from "@/components/catalog/featureset-detail/section-nav";
import { UsedBySection } from "@/components/catalog/featureset-detail/used-by-section";
import { VersionSelector } from "@/components/catalog/featureset-detail/version-selector";
import { VersionsSection } from "@/components/catalog/featureset-detail/versions-section";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function FeaturesetDetailPage({ params }: Props) {
  const { name } = await params;
  const featuresets = await fetchFeaturesets();
  const fs = featuresets.find((f) => f.name === decodeURIComponent(name));

  if (!fs) notFound();

  const features = fs.spec.features ?? [];
  const extractors = fs.spec.extractors ?? [];

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "schema", label: "Schema" },
    { id: "versions", label: "Versions" },
    { id: "lineage", label: "Lineage" },
    { id: "used-by", label: "Used by" },
    { id: "examples", label: "Examples" },
    { id: "recent-queries", label: "Recent queries" },
    { id: "activity", label: "Activity" },
    ...(extractors.length > 0
      ? [{ id: "extractors", label: "Extractors" }]
      : []),
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Catalog", href: "/catalog" },
          { label: "Featuresets", href: "/catalog" },
          { label: fs.name },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <FeaturesetDetailHeader fs={fs} />
        </div>
        <div className="flex items-center gap-2">
          <HeaderActions
            featuresetName={fs.name}
            isDeprecated={Boolean(
              fs.metadata?.deprecated_at || fs.metadata?.deprecated,
            )}
          />
          <VersionSelector featuresetName={fs.name} />
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-48 shrink-0 md:block">
          <SectionNav sections={sections} />
        </aside>
        <main className="flex-1 space-y-8">
          <OverviewSection fs={fs} />
          <SchemaSection features={features} />
          <VersionsSection featuresetName={fs.name} />
          <LineageSection featuresetName={fs.name} />
          <UsedBySection featuresetName={fs.name} />
          <ExamplesSection fs={fs} />
          <RecentQueriesSection featuresetName={fs.name} />
          <ActivitySection featuresetName={fs.name} />
          <ExtractorsSection extractors={extractors} />
        </main>
      </div>
    </div>
  );
}
