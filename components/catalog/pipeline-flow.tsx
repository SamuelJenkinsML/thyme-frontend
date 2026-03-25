import { Database, ArrowDownToLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OperatorCard } from "./operator-card";
import type { PipelineOperator } from "@/lib/types";

interface PipelineFlowProps {
  inputTopic: string;
  outputTopic: string;
  operators: PipelineOperator[];
}

export function PipelineFlow({ inputTopic, outputTopic, operators }: PipelineFlowProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Input topic node */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5">
        <Database className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-sm">{inputTopic}</span>
        <Badge variant="ghost" className="text-[10px]">input</Badge>
      </div>

      {/* Operators */}
      {operators.map((op, i) => (
        <div key={i} className="flex flex-col items-center w-full max-w-md">
          {/* Connector line */}
          <div className="w-px h-6 bg-border" />
          <div className="text-muted-foreground text-xs mb-1">&#9660;</div>
          <div className="w-full">
            <OperatorCard operator={op} index={i} />
          </div>
        </div>
      ))}

      {/* Final connector */}
      <div className="w-px h-6 bg-border" />
      <div className="text-muted-foreground text-xs mb-1">&#9660;</div>

      {/* Output topic node */}
      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5">
        <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
        <span className="font-mono text-sm">{outputTopic}</span>
        <Badge variant="ghost" className="text-[10px]">output</Badge>
      </div>
    </div>
  );
}
