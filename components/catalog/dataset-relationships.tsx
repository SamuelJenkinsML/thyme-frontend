import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConnectorIcon, getConnectorLabel } from "@/components/catalog/connector-icon";
import { Workflow, Layers, ArrowRight } from "lucide-react";
import type {
  StatusPipeline,
  StatusDataset,
  StatusFeatureset,
  SourceRecord,
} from "@/lib/types";

interface DatasetRelationshipsProps {
  source?: SourceRecord | null;
  consumingPipelines: StatusPipeline[];
  producingPipeline?: StatusPipeline | null;
  outputDatasets: StatusDataset[];
  derivedFeaturesets: StatusFeatureset[];
}

export function DatasetRelationships({
  source,
  consumingPipelines,
  producingPipeline,
  outputDatasets,
  derivedFeaturesets,
}: DatasetRelationshipsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Source connector */}
      {source && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <ConnectorIcon
                connectorType={source.connector_type}
                className="text-emerald-400"
                size={16}
              />
              Source Connector
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Type</span>
              <Badge variant="outline">
                {getConnectorLabel(source.connector_type)}
              </Badge>
            </div>
            {source.cdc && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">CDC Mode</span>
                <Badge variant="secondary">{source.cdc}</Badge>
              </div>
            )}
            {source.max_lateness && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Max lateness</span>
                <span className="font-mono">{source.max_lateness}</span>
              </div>
            )}
            {source.cursor_value && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last cursor</span>
                <span className="font-mono text-xs truncate max-w-[200px]">
                  {source.cursor_value}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Producing pipeline */}
      {producingPipeline && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Workflow className="h-4 w-4 text-purple-400" />
              Produced By
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/catalog/pipelines/${encodeURIComponent(producingPipeline.name)}`}
              className="flex items-center gap-2 rounded-md border border-purple-500/20 bg-purple-500/5 px-3 py-2 text-sm font-mono hover:bg-purple-500/10 transition-colors"
            >
              <Workflow className="h-3.5 w-3.5 text-purple-400" />
              {producingPipeline.name}
              <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
            </Link>
            <div className="mt-2 text-xs text-muted-foreground">
              From:{" "}
              {producingPipeline.input_datasets.map((ds, i) => (
                <span key={ds}>
                  {i > 0 && ", "}
                  <Link
                    href={`/catalog/datasets/${encodeURIComponent(ds)}`}
                    className="text-blue-400 hover:underline"
                  >
                    {ds}
                  </Link>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consuming pipelines */}
      {consumingPipelines.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Workflow className="h-4 w-4 text-purple-400" />
              Consuming Pipelines
              <Badge variant="secondary" className="ml-auto">
                {consumingPipelines.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {consumingPipelines.map((pl) => (
              <Link
                key={pl.name}
                href={`/catalog/pipelines/${encodeURIComponent(pl.name)}`}
                className="flex items-center gap-2 rounded-md border border-border/50 px-3 py-2 text-sm font-mono hover:bg-muted/50 transition-colors"
              >
                <Workflow className="h-3.5 w-3.5 text-purple-400" />
                {pl.name}
                <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            ))}
            {outputDatasets.length > 0 && (
              <div className="mt-2 text-xs text-muted-foreground">
                Output:{" "}
                {outputDatasets.map((ds, i) => (
                  <span key={ds.name}>
                    {i > 0 && ", "}
                    <Link
                      href={`/catalog/datasets/${encodeURIComponent(ds.name)}`}
                      className="text-blue-400 hover:underline"
                    >
                      {ds.name}
                    </Link>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Derived featuresets */}
      {derivedFeaturesets.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-400" />
              Derived Featuresets
              <Badge variant="secondary" className="ml-auto">
                {derivedFeaturesets.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {derivedFeaturesets.map((fs) => (
              <Link
                key={fs.name}
                href={`/catalog/featuresets/${encodeURIComponent(fs.name)}`}
                className="flex items-center justify-between rounded-md border border-border/50 px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-amber-400" />
                  <span className="font-mono">{fs.name}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {fs.feature_count} features
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
