// Catalog metadata (TH-CAT-A1..A5 round-trip)
export interface EntityMetadata {
  description?: string | null;
  owner?: string | null;
  tags?: Record<string, string>;
  project?: string | null;
  deprecated?: boolean;
  deprecation_reason?: string | null;
  replacement?: string | null;
  created_at?: string;
  updated_at?: string;
  deprecated_at?: string | null;
}

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
}

export interface LookupInfo {
  dataset_name: string;
  field_name: string;
  default?: string | number | boolean | null;
}

export interface ExtractorDef {
  name: string;
  inputs: string[];
  outputs: string[];
  deps: string[];
  pycode?: PyCodeDef;
  kind?: "PY_FUNC" | "LOOKUP";
  lookup_info?: LookupInfo;
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
  metadata?: EntityMetadata;
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
    max_lateness?: string;
  };
}

export interface JobRecord {
  id: string;
  name: string;
  job_type: string;
  spec: JobSpec;
  partition_count: number;
  metadata?: EntityMetadata;
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
  max_lateness?: string;
  cdc?: string;
  metadata?: EntityMetadata;
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

// Query runs — metadata-only audit records of every CLI/SDK query.
export type QueryRunKind = "online" | "batch" | "offline" | "lookup";

export interface QueryRun {
  id: string;
  featureset: string;
  entity_ids: string[];
  requested_timestamp: string | null;
  kind: QueryRunKind | string;
  row_count: number;
  hit_count: number;
  latency_ms: number;
  api_key_fingerprint: string | null;
  error: string | null;
  created_at: string;
}

export interface QueryRunsListResponse {
  runs: QueryRun[];
}

export interface ReplayResponse {
  kind: string;
  result: unknown;
}

// Datasets and pipelines — wire shapes returned by /api/v1/search (TH-CAT-C1)
// and the future per-kind list endpoints. Mirrors crates/definition-service/
// src/metadata.rs:951 / :965.
export interface DatasetRecord {
  id: string;
  name: string;
  version: number;
  schema: Record<string, unknown>;
  primary_keys: string[];
  time_field: string;
  metadata?: EntityMetadata;
}

export interface PipelineRecord {
  id: string;
  name: string;
  version: number;
  input_datasets: string[];
  output_dataset: string;
}

// Server-backed catalog search (TH-CAT-C1 backend + TH-CAT-C4 hooks).
export interface FacetCount {
  name: string;
  count: number;
}

export interface SearchParams {
  q?: string;
  kinds?: string[];
  tags?: string[];
  owners?: string[];
  project?: string;
  limit?: number;
}

export interface SearchResponse {
  featuresets: FeaturesetRecord[];
  datasets: DatasetRecord[];
  pipelines: PipelineRecord[];
  sources: SourceRecord[];
  tags: FacetCount[];
  owners: FacetCount[];
  projects: FacetCount[];
}

// Catalog projects (TH-CAT-D2 backend + TH-CAT-D3 frontend).
// `member_count` is per metadata-bearing kind (pipelines deliberately omitted —
// no @pipeline metadata decorator). `freshness` buckets entity `updated_at`
// across all kinds: fresh < 24h, stale 24h..7d, broken > 7d.
export interface ProjectMemberCount {
  featuresets: number;
  datasets: number;
  sources: number;
}

export interface ProjectFreshness {
  fresh: number;
  stale: number;
  broken: number;
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string | null;
  owner?: string | null;
  member_count: ProjectMemberCount;
  freshness: ProjectFreshness;
  created_at: string;
  updated_at: string;
}

export interface ProjectMembers {
  featuresets: FeaturesetRecord[];
  datasets: DatasetRecord[];
  sources: SourceRecord[];
}

export interface ProjectDetail {
  id: string;
  name: string;
  description?: string | null;
  owner?: string | null;
  created_at: string;
  updated_at: string;
  members: ProjectMembers;
  freshness: ProjectFreshness;
}

// Featureset versioning (TH-CAT-E2/E3)
export interface FeaturesetVersionSummary {
  version: number;
  parent_version: number | null;
  created_at: string;
  graph_commit_id: string | null;
}

export interface FeaturesetVersionsResponse {
  name: string;
  versions: FeaturesetVersionSummary[];
}

export interface FeaturesetVersionDetail {
  name: string;
  version: number;
  parent_version: number | null;
  spec: FeaturesetSpec;
  metadata: Record<string, unknown>;
  created_at: string;
  graph_commit_id: string | null;
}

// Featureset deprecation (TH-CAT-E5/E6)
export interface DeprecateRequest {
  reason?: string | null;
  replacement?: string | null;
}

export interface DeprecateResult {
  name: string;
  deprecated_at: string;
  deprecation_reason: string | null;
  replacement: string | null;
}

// Featureset diff (TH-CAT-E2/E4)
export interface DiffFeatureAddRemove {
  name: string;
  dtype: string;
}

export interface DiffFeatureChange {
  name: string;
  from_dtype: string;
  to_dtype: string;
}

export interface FeaturesetDiff {
  name: string;
  from: number;
  to: number;
  added: DiffFeatureAddRemove[];
  removed: DiffFeatureAddRemove[];
  changed: DiffFeatureChange[];
  extractors_added: string[];
  extractors_removed: string[];
  extractors_changed: string[];
}

// Reverse lineage (TH-CAT-B2)
export type DependentsKind = "featuresets" | "datasets" | "pipelines" | "sources";

export type DependentEdgeType =
  | "pipeline_input"
  | "source_feeds"
  | "featureset_lookup"
  | "featureset_dep";

export interface DependentRecord {
  kind: string;
  name: string;
  edge_type: DependentEdgeType;
}

export interface DependentsResponse {
  kind: string;
  name: string;
  dependents: DependentRecord[];
}
