"use client";

import { useMemo, useState, useCallback } from "react";
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
import { buildLineageGraph } from "@/lib/lineage";
import {
  LineageSourceNode,
  LineageDatasetNode,
  LineagePipelineNode,
  LineageFeatureNode,
  RestApiNode,
  AnnotationNode,
} from "./lineage-nodes";
import { LineageCodePanel } from "./lineage-code-panel";
import { Skeleton } from "@/components/ui/skeleton";
import type { FeaturesetRecord } from "@/lib/types";

const nodeTypes = {
  lineageSource: LineageSourceNode,
  lineageDataset: LineageDatasetNode,
  lineagePipeline: LineagePipelineNode,
  lineageFeature: LineageFeatureNode,
  restApi: RestApiNode,
  annotation: AnnotationNode,
};

function findCodeForNode(
  node: Node,
  featuresets: FeaturesetRecord[],
): { title: string; code: string } | null {
  if (node.type === "lineageFeature") {
    const fs = featuresets.find((f) => f.name === node.data.label);
    if (fs?.spec.pycode?.source_code) {
      return { title: fs.name, code: fs.spec.pycode.source_code };
    }
    // Try extractor pycode
    if (fs) {
      for (const ext of fs.spec.extractors) {
        if (ext.pycode?.source_code) {
          return { title: `${fs.name} — ${ext.name}`, code: ext.pycode.source_code };
        }
      }
    }
  }
  return null;
}

function LineageInner() {
  const router = useRouter();
  const { data: status, isLoading: statusLoading } = useStatus(30_000);
  const { data: featuresets, isLoading: featuresetsLoading } = useFeaturesets();
  const [showCode, setShowCode] = useState(false);
  const [codePanel, setCodePanel] = useState<{
    title: string;
    code: string;
  } | null>(null);

  const { nodes, edges } = useMemo(() => {
    if (!status || !featuresets) return { nodes: [], edges: [] };
    return buildLineageGraph(status, featuresets);
  }, [status, featuresets]);

  const isLoading = statusLoading || featuresetsLoading;

  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (showCode && featuresets) {
        const code = findCodeForNode(node, featuresets);
        if (code) {
          setCodePanel(code);
          return;
        }
      }
      const href = node.data?.href as string | undefined;
      if (href) router.push(href);
    },
    [showCode, featuresets, router],
  );

  if (isLoading) {
    return (
      <div className="h-[600px] w-full rounded-lg border border-border">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  const realNodes = nodes.filter((n) => n.type !== "annotation");
  if (realNodes.length === 0) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          No entities defined yet. Commit a feature definition to see the
          lineage view.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] w-full rounded-lg border border-zinc-800 overflow-hidden">
      {/* Show Code toggle */}
      <button
        onClick={() => {
          setShowCode((prev) => !prev);
          if (showCode) setCodePanel(null);
        }}
        className={`absolute top-3 left-3 z-10 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
          showCode
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
            : "border-zinc-700 bg-zinc-900/80 text-zinc-400 hover:text-zinc-200"
        }`}
      >
        Show Code
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
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

      <LineageCodePanel
        open={codePanel !== null}
        title={codePanel?.title ?? ""}
        code={codePanel?.code ?? ""}
        onClose={() => setCodePanel(null)}
      />
    </div>
  );
}

export function LineageGraph() {
  return (
    <ReactFlowProvider>
      <LineageInner />
    </ReactFlowProvider>
  );
}
