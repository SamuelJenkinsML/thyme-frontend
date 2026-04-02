import { Badge } from "@/components/ui/badge";
import { ConnectorIcon, getConnectorLabel } from "@/components/catalog/connector-icon";
import type { StatusDataset, SourceRecord } from "@/lib/types";

interface DatasetDetailHeaderProps {
  dataset: StatusDataset;
  source?: SourceRecord | null;
}

export function DatasetDetailHeader({
  dataset,
  source,
}: DatasetDetailHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{dataset.name}</h1>
        <Badge variant="outline" className="font-mono text-xs">
          v{dataset.version}
        </Badge>
        {source && (
          <>
            <Badge className="gap-1.5">
              <ConnectorIcon
                connectorType={source.connector_type}
                size={12}
              />
              {getConnectorLabel(source.connector_type)}
            </Badge>
            {source.cdc && (
              <Badge variant="secondary">{source.cdc}</Badge>
            )}
          </>
        )}
      </div>

      {source && (
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${source.cursor_value ? "bg-emerald-500" : "bg-zinc-500"}`}
            />
            <span>{source.cursor_value ? "Active" : "No data yet"}</span>
          </div>
          {source.poll_interval && (
            <div>
              <span className="text-muted-foreground/60">Poll interval:</span>{" "}
              <span className="font-mono">{source.poll_interval}</span>
            </div>
          )}
          {source.cursor_field && (
            <div>
              <span className="text-muted-foreground/60">Cursor:</span>{" "}
              <span className="font-mono">{source.cursor_field}</span>
            </div>
          )}
        </div>
      )}

      {!source && (
        <p className="text-sm text-muted-foreground">
          Pipeline-produced dataset
        </p>
      )}
    </div>
  );
}
