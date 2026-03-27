"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Database, Workflow, Layers } from "lucide-react";

export function DatasetNode({ data }: NodeProps) {
  return (
    <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-500/20 transition-colors">
      <Handle type="target" position={Position.Left} className="!bg-blue-500 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <Database className="h-4 w-4 text-blue-400 shrink-0" />
        <span className="font-medium text-foreground truncate">{data.label as string}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-blue-500 !w-2 !h-2" />
    </div>
  );
}

export function PipelineNode({ data }: NodeProps) {
  return (
    <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2.5 text-sm cursor-pointer hover:bg-purple-500/20 transition-colors">
      <Handle type="target" position={Position.Left} className="!bg-purple-500 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <Workflow className="h-4 w-4 text-purple-400 shrink-0" />
        <span className="font-medium text-foreground truncate">{data.label as string}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-purple-500 !w-2 !h-2" />
    </div>
  );
}

export function FeaturesetNode({ data }: NodeProps) {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm cursor-pointer hover:bg-amber-500/20 transition-colors">
      <Handle type="target" position={Position.Left} className="!bg-amber-500 !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <Layers className="h-4 w-4 text-amber-400 shrink-0" />
        <span className="font-medium text-foreground truncate">{data.label as string}</span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-amber-500 !w-2 !h-2" />
    </div>
  );
}
