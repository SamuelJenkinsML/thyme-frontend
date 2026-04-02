"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Globe, Workflow } from "lucide-react";
import { ConnectorIcon } from "@/components/catalog/connector-icon";

export function LineageSourceNode({ data }: NodeProps) {
  return (
    <div className="group relative rounded-xl border border-emerald-500/20 bg-emerald-950/40 px-5 py-3 text-sm backdrop-blur-sm transition-all hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
      <div className="flex items-center gap-3">
        <ConnectorIcon
          connectorType={data.connectorType as string}
          className="text-emerald-400/70"
          size={20}
        />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-emerald-400/50">
            {data.connectorType as string}
          </span>
          <span className="font-medium text-emerald-100">
            {data.label as string}
          </span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-emerald-500 !w-2 !h-2 !border-emerald-400"
      />
    </div>
  );
}

export function LineageDatasetNode({ data }: NodeProps) {
  return (
    <div className="group relative rounded-xl border border-indigo-500/20 bg-indigo-950/40 px-5 py-3 text-sm backdrop-blur-sm transition-all hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-indigo-500 !w-2 !h-2 !border-indigo-400"
      />
      {/* Cylinder decoration */}
      <div className="absolute -top-1 left-3 right-3 h-2 rounded-t-full border-t border-x border-indigo-500/20 bg-indigo-500/5" />
      <div className="flex flex-col pt-1">
        <span className="font-medium text-indigo-100">
          {data.label as string}
        </span>
        {data.version != null && (
          <span className="text-[10px] text-indigo-400/60 font-mono">
            v{data.version as number}
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-indigo-500 !w-2 !h-2 !border-indigo-400"
      />
    </div>
  );
}

export function LineagePipelineNode({ data }: NodeProps) {
  return (
    <div className="group relative rounded-xl border border-purple-500/20 bg-purple-950/40 px-5 py-3 text-sm backdrop-blur-sm transition-all hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-purple-500 !w-2 !h-2 !border-purple-400"
      />
      <div className="flex items-center gap-2">
        <Workflow className="h-4 w-4 text-purple-400/70 shrink-0" />
        <span className="font-medium text-purple-100 truncate">
          {data.label as string}
        </span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-purple-500 !w-2 !h-2 !border-purple-400"
      />
    </div>
  );
}

export function LineageFeatureNode({ data }: NodeProps) {
  return (
    <div className="group relative rounded-xl border border-emerald-400/30 bg-emerald-900/50 px-5 py-3 text-sm backdrop-blur-sm transition-all hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-emerald-400 !w-2 !h-2 !border-emerald-300"
      />
      <div className="flex flex-col">
        <span className="font-semibold text-emerald-50">
          {data.label as string}
        </span>
        {data.featureCount != null && (
          <span className="text-[10px] text-emerald-400/70">
            {data.featureCount as number} features
          </span>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-emerald-400 !w-2 !h-2 !border-emerald-300"
      />
    </div>
  );
}

export function RestApiNode({ data }: NodeProps) {
  return (
    <div className="group relative rounded-xl border border-zinc-500/20 bg-zinc-900/50 px-5 py-3 text-sm backdrop-blur-sm transition-all hover:border-zinc-500/40">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-zinc-400 !w-2 !h-2 !border-zinc-300"
      />
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-zinc-400/70 shrink-0" />
        <span className="font-medium text-zinc-300">
          {data.label as string}
        </span>
      </div>
    </div>
  );
}

export function AnnotationNode({ data }: NodeProps) {
  return (
    <div className="pointer-events-none select-none px-4 py-1 text-xs font-mono tracking-wider">
      <span className="text-emerald-500/60">Write Path ▸▸</span>
      <span className="mx-4 text-zinc-600">│</span>
      <span className="text-indigo-400/60">◂◂ Read Path</span>
    </div>
  );
}
