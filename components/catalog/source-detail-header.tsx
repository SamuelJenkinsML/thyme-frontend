import { Badge } from "@/components/ui/badge";
import { ConnectorIcon, getConnectorLabel } from "@/components/catalog/connector-icon";
import type { SourceRecord } from "@/lib/types";

interface SourceDetailHeaderProps {
  source: SourceRecord;
}

export function SourceDetailHeader({ source }: SourceDetailHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <ConnectorIcon
          connectorType={source.connector_type}
          className="text-emerald-400"
          size={28}
        />
        <h1 className="text-2xl font-bold tracking-tight">{source.dataset}</h1>
        <Badge className="text-sm">
          {getConnectorLabel(source.connector_type)}
        </Badge>
        {source.cdc && <Badge variant="secondary">{source.cdc}</Badge>}
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${source.cursor_value ? "bg-emerald-500" : "bg-zinc-500"}`}
          />
          <span>{source.cursor_value ? "Active" : "Awaiting data"}</span>
        </div>
        {source.cursor_field && (
          <div>
            <span className="text-muted-foreground/60">Cursor:</span>{" "}
            <span className="font-mono">{source.cursor_field}</span>
          </div>
        )}
        {source.poll_interval && (
          <div>
            <span className="text-muted-foreground/60">Poll:</span>{" "}
            <span className="font-mono">{source.poll_interval}</span>
          </div>
        )}
        {source.disorder && (
          <div>
            <span className="text-muted-foreground/60">Disorder:</span>{" "}
            <span className="font-mono">{source.disorder}</span>
          </div>
        )}
      </div>
    </div>
  );
}
