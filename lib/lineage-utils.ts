import type {
  StatusResponse,
  StatusDataset,
  StatusPipeline,
  StatusFeatureset,
  FeaturesetRecord,
  SourceRecord,
} from "@/lib/types";

export interface DatasetDownstream {
  pipelines: StatusPipeline[];
  outputDatasets: StatusDataset[];
  featuresets: StatusFeatureset[];
}

export function getDownstreamFromDataset(
  datasetName: string,
  status: StatusResponse,
  featuresets: FeaturesetRecord[],
): DatasetDownstream {
  // Find pipelines that consume this dataset
  const consumingPipelines = status.pipelines.filter((pl) =>
    pl.input_datasets.includes(datasetName),
  );

  // Collect output datasets from those pipelines
  const outputDatasetNames = new Set(
    consumingPipelines.map((pl) => pl.output_dataset).filter(Boolean),
  );
  const outputDatasets = status.datasets.filter((ds) =>
    outputDatasetNames.has(ds.name),
  );

  // Find featuresets whose extractors depend on this dataset
  const derivedFeaturesets = status.featuresets.filter((sf) => {
    const full = featuresets.find((f) => f.name === sf.name);
    if (!full) return false;
    return full.spec.extractors.some((ext) => ext.deps.includes(datasetName));
  });

  return {
    pipelines: consumingPipelines,
    outputDatasets,
    featuresets: derivedFeaturesets,
  };
}

export interface FeaturesetUpstream {
  datasets: StatusDataset[];
  pipelines: StatusPipeline[];
  sources: Pick<SourceRecord, "id" | "dataset" | "connector_type">[];
}

export function getUpstreamForFeatureset(
  featuresetName: string,
  status: StatusResponse,
  featuresets: FeaturesetRecord[],
  sources: Pick<SourceRecord, "id" | "dataset" | "connector_type">[],
): FeaturesetUpstream {
  const full = featuresets.find((f) => f.name === featuresetName);
  if (!full) return { datasets: [], pipelines: [], sources: [] };

  // Get dataset deps from extractors
  const depDatasetNames = new Set(
    full.spec.extractors.flatMap((ext) => ext.deps),
  );

  const depDatasets = status.datasets.filter((ds) =>
    depDatasetNames.has(ds.name),
  );

  // Find pipelines that produce these dep datasets
  const producingPipelines = status.pipelines.filter((pl) =>
    depDatasetNames.has(pl.output_dataset),
  );

  // Collect all input datasets from producing pipelines
  const inputDatasetNames = new Set(
    producingPipelines.flatMap((pl) => pl.input_datasets),
  );

  // Find sources for those input datasets
  const upstreamSources = sources.filter((src) =>
    inputDatasetNames.has(src.dataset),
  );

  return {
    datasets: depDatasets,
    pipelines: producingPipelines,
    sources: upstreamSources,
  };
}

export interface SourceDownstream {
  dataset: StatusDataset | null;
  pipelines: StatusPipeline[];
  outputDatasets: StatusDataset[];
  featuresets: StatusFeatureset[];
}

export function getDownstreamFromSource(
  datasetName: string,
  _connectorType: string,
  status: StatusResponse,
  featuresets: FeaturesetRecord[],
): SourceDownstream {
  const dataset = status.datasets.find((ds) => ds.name === datasetName) ?? null;
  if (!dataset) {
    return { dataset: null, pipelines: [], outputDatasets: [], featuresets: [] };
  }

  // Get direct downstream from this dataset
  const direct = getDownstreamFromDataset(datasetName, status, featuresets);

  // Also collect featuresets from output datasets
  const allFeaturesets = new Set(direct.featuresets.map((f) => f.name));
  for (const outDs of direct.outputDatasets) {
    const outDownstream = getDownstreamFromDataset(outDs.name, status, featuresets);
    for (const fs of outDownstream.featuresets) {
      allFeaturesets.add(fs.name);
    }
  }

  const featuresetResults = status.featuresets.filter((sf) =>
    allFeaturesets.has(sf.name),
  );

  return {
    dataset,
    pipelines: direct.pipelines,
    outputDatasets: direct.outputDatasets,
    featuresets: featuresetResults,
  };
}
