import { notFound } from "next/navigation";
import {
  fetchStatus,
  fetchSources,
  fetchJobs,
  fetchFeaturesets,
} from "@/lib/api/definition";
import { getDownstreamFromDataset } from "@/lib/lineage-utils";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatasetDetailHeader } from "@/components/catalog/dataset-detail-header";
import { DatasetRelationships } from "@/components/catalog/dataset-relationships";
import { DatasetEventsSection } from "@/components/catalog/dataset-events-section";
import { CodeBlock } from "@/components/ui/code-block";
import { SourceConfigViewer } from "@/components/catalog/source-config-viewer";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function DatasetDetailPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const [status, sources, jobs, featuresetRecords] = await Promise.all([
    fetchStatus(),
    fetchSources(),
    fetchJobs(),
    fetchFeaturesets(),
  ]);

  // Find dataset in status (works for both source-backed and pipeline-produced)
  const dataset = status.datasets.find((ds) => ds.name === decodedName);
  if (!dataset) notFound();

  const src = sources.find((s) => s.dataset === decodedName) ?? null;

  // Compute relationships
  const downstream = getDownstreamFromDataset(
    decodedName,
    status,
    featuresetRecords,
  );

  // Find producing pipeline (if this dataset is an output)
  const producingPipeline =
    status.pipelines.find((pl) => pl.output_dataset === decodedName) ?? null;

  // Find consuming jobs for additional context
  const topic = `${decodedName}_topic`;
  const consumingJobs = jobs.filter((j) => j.spec.input_topic === topic);

  // Find pycode from featuresets that depend on this dataset
  const relatedFeatureset = featuresetRecords.find((fs) =>
    fs.spec.extractors.some((ext) => ext.deps.includes(decodedName)),
  );
  const pycode = relatedFeatureset?.spec.pycode?.source_code;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Catalog", href: "/catalog" },
          { label: "Datasets", href: "/catalog" },
          { label: decodedName },
        ]}
      />

      <DatasetDetailHeader dataset={dataset} source={src} />

      <DatasetRelationships
        source={src}
        consumingPipelines={downstream.pipelines}
        producingPipeline={producingPipeline}
        outputDatasets={downstream.outputDatasets}
        derivedFeaturesets={downstream.featuresets}
      />

      {/* Connector config */}
      {src && <SourceConfigViewer config={src.config} />}

      {/* Source code definition */}
      {pycode && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Definition</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock code={pycode} />
          </CardContent>
        </Card>
      )}

      {/* Consuming jobs (additional detail beyond pipelines) */}
      {consumingJobs.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Active Jobs ({consumingJobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm">
              {consumingJobs.map((j) => (
                <div
                  key={j.id}
                  className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2"
                >
                  <span className="font-mono">{j.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {j.partition_count} partitions
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events (client component) */}
      <DatasetEventsSection datasetName={decodedName} />
    </div>
  );
}
