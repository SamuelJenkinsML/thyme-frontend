import { notFound } from "next/navigation";
import {
  fetchStatus,
  fetchSources,
  fetchFeaturesets,
} from "@/lib/api/definition";
import { getDownstreamFromSource } from "@/lib/lineage-utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SourceDetailHeader } from "@/components/catalog/source-detail-header";
import { SourceConfigViewer } from "@/components/catalog/source-config-viewer";
import { SourceDownstream } from "@/components/catalog/source-downstream";
import { DatasetEventsSection } from "@/components/catalog/dataset-events-section";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SourceDetailPage({ params }: Props) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const [status, sources, featuresetRecords] = await Promise.all([
    fetchStatus(),
    fetchSources(),
    fetchFeaturesets(),
  ]);

  const source = sources.find((s) => s.id === decodedId);
  if (!source) notFound();

  const downstream = getDownstreamFromSource(
    source.dataset,
    source.connector_type,
    status,
    featuresetRecords,
  );

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Sources", href: "/sources" },
          { label: source.dataset },
        ]}
      />

      <SourceDetailHeader source={source} />

      {downstream.dataset && (
        <SourceDownstream
          dataset={downstream.dataset}
          pipelines={downstream.pipelines}
          outputDatasets={downstream.outputDatasets}
          featuresets={downstream.featuresets}
        />
      )}

      <SourceConfigViewer config={source.config} />

      {/* Events for this source's dataset */}
      <DatasetEventsSection datasetName={source.dataset} />
    </div>
  );
}
