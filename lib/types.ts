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

// Jobs
export interface JobSpec {
  name: string;
  partition_count: number;
  input_topic: string;
  output_topic: string;
  replaylog_topic: string;
  pipeline_spec: {
    operators: unknown[];
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
