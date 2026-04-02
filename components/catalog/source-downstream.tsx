import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Workflow,
  Layers,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import type {
  StatusDataset,
  StatusPipeline,
  StatusFeatureset,
} from "@/lib/types";

interface SourceDownstreamProps {
  dataset: StatusDataset;
  pipelines: StatusPipeline[];
  outputDatasets: StatusDataset[];
  featuresets: StatusFeatureset[];
}

export function SourceDownstream({
  dataset,
  pipelines,
  outputDatasets,
  featuresets,
}: SourceDownstreamProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ArrowRight className="h-4 w-4 text-emerald-400" />
          Downstream Lineage
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Visual flow */}
        <div className="flex items-start gap-2 overflow-x-auto pb-2">
          {/* Dataset */}
          <div className="shrink-0">
            <Link
              href={`/catalog/datasets/${encodeURIComponent(dataset.name)}`}
              className="flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-sm hover:bg-indigo-500/10 transition-colors"
            >
              <Database className="h-4 w-4 text-indigo-400" />
              <span className="font-mono">{dataset.name}</span>
            </Link>
          </div>

          {pipelines.length > 0 && (
            <>
              <ChevronRight className="shrink-0 mt-2.5 h-4 w-4 text-muted-foreground" />

              {/* Pipelines */}
              <div className="shrink-0 space-y-1.5">
                {pipelines.map((pl) => (
                  <Link
                    key={pl.name}
                    href={`/catalog/pipelines/${encodeURIComponent(pl.name)}`}
                    className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-2 text-sm hover:bg-purple-500/10 transition-colors"
                  >
                    <Workflow className="h-4 w-4 text-purple-400" />
                    <span className="font-mono">{pl.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {outputDatasets.length > 0 && (
            <>
              <ChevronRight className="shrink-0 mt-2.5 h-4 w-4 text-muted-foreground" />

              {/* Output datasets */}
              <div className="shrink-0 space-y-1.5">
                {outputDatasets.map((ds) => (
                  <Link
                    key={ds.name}
                    href={`/catalog/datasets/${encodeURIComponent(ds.name)}`}
                    className="flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-sm hover:bg-indigo-500/10 transition-colors"
                  >
                    <Database className="h-4 w-4 text-indigo-400" />
                    <span className="font-mono">{ds.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {featuresets.length > 0 && (
            <>
              <ChevronRight className="shrink-0 mt-2.5 h-4 w-4 text-muted-foreground" />

              {/* Featuresets */}
              <div className="shrink-0 space-y-1.5">
                {featuresets.map((fs) => (
                  <Link
                    key={fs.name}
                    href={`/catalog/featuresets/${encodeURIComponent(fs.name)}`}
                    className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm hover:bg-amber-500/10 transition-colors"
                  >
                    <Layers className="h-4 w-4 text-amber-400" />
                    <span className="font-mono">{fs.name}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {fs.feature_count}
                    </Badge>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {pipelines.length === 0 &&
          outputDatasets.length === 0 &&
          featuresets.length === 0 && (
            <p className="text-sm text-muted-foreground py-2">
              No downstream pipelines or featuresets yet.
            </p>
          )}
      </CardContent>
    </Card>
  );
}
