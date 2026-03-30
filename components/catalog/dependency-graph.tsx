"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useStatus } from "@/lib/hooks/use-status";
import { useFeaturesets } from "@/lib/hooks/use-featuresets";
import { buildDependencyGraph } from "@/lib/graph";
import { SourceNode, DatasetNode, PipelineNode, FeaturesetNode } from "./graph-nodes";
import { Skeleton } from "@/components/ui/skeleton";

const nodeTypes = {
  source: SourceNode,
  dataset: DatasetNode,
  pipeline: PipelineNode,
  featureset: FeaturesetNode,
};

function GraphInner() {
  const router = useRouter();
  const { data: status, isLoading: statusLoading } = useStatus(30_000);
  const { data: featuresets, isLoading: featuresetsLoading } = useFeaturesets();

  const { nodes, edges } = useMemo(() => {
    if (!status || !featuresets) return { nodes: [], edges: [] };
    return buildDependencyGraph(status, featuresets);
  }, [status, featuresets]);

  const isLoading = statusLoading || featuresetsLoading;

  if (isLoading) {
    return (
      <div className="h-[600px] w-full rounded-lg border border-border">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          No entities defined yet. Commit a feature definition to see the dependency graph.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[600px] w-full rounded-lg border border-border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_event: React.MouseEvent, node: Node) => {
          const href = node.data?.href as string | undefined;
          if (href) router.push(href);
        }}
        fitView
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "source": return "#10b981";
              case "dataset": return "#3b82f6";
              case "pipeline": return "#a855f7";
              case "featureset": return "#f59e0b";
              default: return "#6b7280";
            }
          }}
        />
      </ReactFlow>
    </div>
  );
}

export function DependencyGraph() {
  return (
    <ReactFlowProvider>
      <GraphInner />
    </ReactFlowProvider>
  );
}
