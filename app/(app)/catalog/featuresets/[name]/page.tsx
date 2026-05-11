import { notFound } from "next/navigation";
import { fetchFeaturesets } from "@/lib/api/definition";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ExtractorsSection } from "@/components/catalog/featureset-detail/extractors-section";
import { FeaturesetDetailHeader } from "@/components/catalog/featureset-detail/header";
import { LineageSection } from "@/components/catalog/featureset-detail/lineage-section";
import { OverviewSection } from "@/components/catalog/featureset-detail/overview-section";
import { SchemaSection } from "@/components/catalog/featureset-detail/schema-section";
import { SectionNav } from "@/components/catalog/featureset-detail/section-nav";
import { UsedBySection } from "@/components/catalog/featureset-detail/used-by-section";

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
    { id: "lineage", label: "Lineage" },
    { id: "used-by", label: "Used by" },
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

      <FeaturesetDetailHeader fs={fs} />

      <div className="flex gap-8">
        <aside className="hidden w-48 shrink-0 md:block">
          <SectionNav sections={sections} />
        </aside>
        <main className="flex-1 space-y-8">
          <OverviewSection fs={fs} />
          <SchemaSection features={features} />
          <LineageSection featuresetName={fs.name} />
          <UsedBySection featuresetName={fs.name} />
          <ExtractorsSection extractors={extractors} />
        </main>
      </div>
    </div>
  );
}
