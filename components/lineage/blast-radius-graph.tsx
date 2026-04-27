"use client";

import { useMemo, useState, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useStatus } from "@/lib/hooks/use-status";
import { useFeaturesets } from "@/lib/hooks/use-featuresets";
import { buildLineageGraph } from "@/lib/lineage";
import {
  LineageSourceNode,
  LineageDatasetNode,
  LineagePipelineNode,
  LineageFeatureNode,
  RestApiNode,
  AnnotationNode,
} from "@/components/catalog/lineage-nodes";
import { NodeDetailPanel } from "./node-detail-panel";
import { Skeleton } from "@/components/ui/skeleton";

const nodeTypes = {
  lineageSource: LineageSourceNode,
  lineageDataset: LineageDatasetNode,
  lineagePipeline: LineagePipelineNode,
  lineageFeature: LineageFeatureNode,
  restApi: RestApiNode,
  annotation: AnnotationNode,
};

const DIM_OPACITY = 0.18;

function blastRadius(rootId: string, edges: Edge[]): Set<string> {
  const forward = new Map<string, string[]>();
  const backward = new Map<string, string[]>();
  for (const e of edges) {
    if (!forward.has(e.source)) forward.set(e.source, []);
    forward.get(e.source)!.push(e.target);
    if (!backward.has(e.target)) backward.set(e.target, []);
    backward.get(e.target)!.push(e.source);
  }

  const visited = new Set<string>([rootId]);
  const walk = (adj: Map<string, string[]>) => {
    const queue = [rootId];
    while (queue.length > 0) {
      const id = queue.shift()!;
      const neighbours = adj.get(id) ?? [];
      for (const n of neighbours) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push(n);
        }
      }
    }
  };
  walk(forward);
  walk(backward);
  return visited;
}

function GraphInner() {
  const { data: status, isLoading: statusLoading } = useStatus(30_000);
  const { data: featuresets, isLoading: featuresetsLoading } = useFeaturesets();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { nodes: rawNodes, edges: rawEdges } = useMemo(() => {
    if (!status || !featuresets) return { nodes: [], edges: [] };
    return buildLineageGraph(status, featuresets);
  }, [status, featuresets]);

  const relatedIds = useMemo(() => {
    if (!selectedId) return null;
    return blastRadius(selectedId, rawEdges);
  }, [selectedId, rawEdges]);

  const displayNodes = useMemo(() => {
    if (!relatedIds) return rawNodes;
    return rawNodes.map((n) => {
      if (n.type === "annotation") return n;
      const dim = !relatedIds.has(n.id);
      return {
        ...n,
        style: { ...(n.style ?? {}), opacity: dim ? DIM_OPACITY : 1 },
      };
    });
  }, [rawNodes, relatedIds]);

  const displayEdges = useMemo(() => {
    if (!relatedIds) return rawEdges;
    return rawEdges.map((e) => {
      const lit = relatedIds.has(e.source) && relatedIds.has(e.target);
      return {
        ...e,
        style: { ...(e.style ?? {}), opacity: lit ? 1 : DIM_OPACITY },
        animated: lit && e.animated,
      };
    });
  }, [rawEdges, relatedIds]);

  const selectedNode = useMemo(() => {
    if (!selectedId) return null;
    return rawNodes.find((n) => n.id === selectedId) ?? null;
  }, [selectedId, rawNodes]);

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.type === "annotation") return;
      setSelectedId(node.id);
    },
    [],
  );

  const handlePaneClick = useCallback(() => {
    setSelectedId(null);
  }, []);

  const isLoading = statusLoading || featuresetsLoading;

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-12rem)] w-full rounded-lg border border-border">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  const realNodes = rawNodes.filter((n) => n.type !== "annotation");
  if (realNodes.length === 0) {
    return (
      <div className="flex h-[calc(100vh-12rem)] items-center justify-center rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          No entities defined yet. Commit a feature definition to see the
          lineage view.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-12rem)] w-full rounded-lg border border-zinc-800 overflow-hidden">
      {selectedId && (
        <div className="absolute top-3 left-3 z-10 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
          Blast radius — click empty space to clear
        </div>
      )}

      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        fitView
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} size={1} color="rgba(255,255,255,0.03)" />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case "lineageSource":
                return "#10b981";
              case "lineageDataset":
                return "#6366f1";
              case "lineagePipeline":
                return "#a855f7";
              case "lineageFeature":
                return "#34d399";
              case "restApi":
                return "#71717a";
              default:
                return "transparent";
            }
          }}
        />
      </ReactFlow>

      <NodeDetailPanel
        node={selectedNode}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}

export function BlastRadiusGraph() {
  return (
    <ReactFlowProvider>
      <GraphInner />
    </ReactFlowProvider>
  );
}
