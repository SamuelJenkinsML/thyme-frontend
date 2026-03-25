import type { PipelineOperator } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const typeColors: Record<string, string> = {
  Aggregate: "border-l-[oklch(0.809_0.105_251.813)]",
  Filter: "border-l-[oklch(0.623_0.214_259.815)]",
  Transform: "border-l-[oklch(0.546_0.245_262.881)]",
  GroupBy: "border-l-[oklch(0.488_0.243_264.376)]",
};

function getOperatorInfo(op: PipelineOperator): { type: string; content: React.ReactNode } {
  if ("aggregate" in op) {
    const a = (op as { aggregate: { agg_type: string; field: string; window: string; output_field: string } }).aggregate;
    return {
      type: "Aggregate",
      content: (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          <span className="text-muted-foreground">Type</span>
          <Badge variant="outline" className="w-fit">{a.agg_type}</Badge>
          <span className="text-muted-foreground">Field</span>
          <span className="font-mono">{a.field}</span>
          <span className="text-muted-foreground">Window</span>
          <span className="font-mono">{a.window}</span>
          <span className="text-muted-foreground">Output</span>
          <span className="font-mono">{a.output_field}</span>
        </div>
      ),
    };
  }

  if ("filter" in op) {
    const f = (op as { filter: { expression: string } }).filter;
    return {
      type: "Filter",
      content: (
        <p className="font-mono text-xs bg-muted rounded px-2 py-1">{f.expression}</p>
      ),
    };
  }

  if ("transform" in op) {
    const t = (op as { transform: { expression: string } }).transform;
    return {
      type: "Transform",
      content: (
        <p className="font-mono text-xs bg-muted rounded px-2 py-1">{t.expression}</p>
      ),
    };
  }

  if ("group_by" in op) {
    const g = (op as { group_by: { keys: string[] } }).group_by;
    return {
      type: "GroupBy",
      content: (
        <div className="flex gap-1 flex-wrap">
          {g.keys.map((k) => (
            <Badge key={k} variant="secondary" className="font-mono">{k}</Badge>
          ))}
        </div>
      ),
    };
  }

  const type = Object.keys(op)[0] ?? "Unknown";
  return {
    type,
    content: (
      <pre className="text-xs font-mono bg-muted rounded p-2 overflow-x-auto whitespace-pre">
        {JSON.stringify(op, null, 2)}
      </pre>
    ),
  };
}

interface OperatorCardProps {
  operator: PipelineOperator;
  index: number;
}

export function OperatorCard({ operator, index }: OperatorCardProps) {
  const { type, content } = getOperatorInfo(operator);
  const borderClass = typeColors[type] ?? "border-l-muted-foreground";

  return (
    <div className={`rounded-lg border border-border bg-card p-3 border-l-4 ${borderClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-muted-foreground">#{index + 1}</span>
        <Badge variant="default">{type}</Badge>
      </div>
      {content}
    </div>
  );
}
