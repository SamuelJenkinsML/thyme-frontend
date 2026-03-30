// Featuresets
export interface PyCodeDef {
  entry_point: string;
  source_code: string;
  generated_code: string;
  imports: string;
}

export interface FeatureDef {
  name: string;
  dtype: string;
  id: number;
}

export interface ExtractorDef {
  name: string;
  inputs: string[];
  outputs: string[];
  deps: string[];
  pycode?: PyCodeDef;
}

export interface FeaturesetSpec {
  name: string;
  features: FeatureDef[];
  extractors: ExtractorDef[];
  pycode?: PyCodeDef;
}

export interface FeaturesetRecord {
  id: string;
  name: string;
  spec: FeaturesetSpec;
}

// Pipeline operators
export interface AggregateOp {
  aggregate: { agg_type: string; field: string; window: string; output_field: string };
}
export interface FilterOp {
  filter: { expression: string };
}
export interface TransformOp {
  transform: { expression: string };
}
export interface GroupByOp {
  group_by: { keys: string[] };
}
export type PipelineOperator =
  | AggregateOp
  | FilterOp
  | TransformOp
  | GroupByOp
  | Record<string, unknown>;

// Jobs
export interface JobSpec {
  name: string;
  partition_count: number;
  input_topic: string;
  output_topic: string;
  replaylog_topic: string;
  pipeline_spec: {
    operators: PipelineOperator[];
    disorder?: string;
  };
}

export interface JobRecord {
  id: string;
  name: string;
  job_type: string;
  spec: JobSpec;
  partition_count: number;
}

// Sources
export interface SourceRecord {
  id: string;
  dataset: string;
  connector_type: string;
  config: Record<string, unknown>;
  cursor_field: string;
  poll_interval: string;
  cursor_value: string;
  disorder?: string;
  cdc?: string;
}

// Feature query/response
export interface FeatureQuery {
  entity_id: string;
  entity_type?: string;
  featureset?: string;
  timestamp?: string;
}

export interface FeatureResponse {
  entity_type: string;
  entity_id: string;
  features: Record<string, unknown>;
  mode: string;
}

// Status (dependency graph data)
export interface StatusDataset {
  name: string;
  version: number;
}

export interface StatusPipeline {
  name: string;
  version: number;
  input_datasets: string[];
  output_dataset: string;
}

export interface StatusFeatureset {
  name: string;
  feature_count: number;
}

export interface StatusResponse {
  datasets: StatusDataset[];
  pipelines: StatusPipeline[];
  featuresets: StatusFeatureset[];
  sources: Array<{ dataset: string; connector_type: string }>;
  jobs: unknown[];
  backfills: unknown[];
  latest_commit: Record<string, unknown> | null;
  recent_events: unknown[];
  physical_assets: unknown[];
}

// Events
export interface EventRecord {
  id: string;
  event_type: string;
  severity: string;
  source: string;
  subject: string;
  message: string;
  detail: Record<string, unknown> | null;
  created_at: string;
}
