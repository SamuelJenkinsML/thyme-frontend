import type { Node, Edge } from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import type { StatusResponse, FeaturesetRecord } from "@/lib/types";

const NODE_WIDTH = 220;
const NODE_HEIGHT = 60;

export function buildDependencyGraph(
  status: StatusResponse,
  featuresets: FeaturesetRecord[],
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const edgeSet = new Set<string>();
  const datasetNames = new Set(status.datasets.map((ds) => ds.name));

  // Source nodes + edges to datasets
  for (const src of status.sources) {
    const nodeId = `source-${src.dataset}-${src.connector_type}`;
    nodes.push({
      id: nodeId,
      type: "source",
      position: { x: 0, y: 0 },
      data: {
        label: src.dataset,
        connectorType: src.connector_type,
      },
    });

    if (datasetNames.has(src.dataset)) {
      const key = `${nodeId}->dataset-${src.dataset}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({
          id: key,
          source: nodeId,
          target: `dataset-${src.dataset}`,
          animated: true,
        });
      }
    }
  }

  // Dataset nodes
  for (const ds of status.datasets) {
    nodes.push({
      id: `dataset-${ds.name}`,
      type: "dataset",
      position: { x: 0, y: 0 },
      data: {
        label: ds.name,
        href: `/catalog/datasets/${ds.name}`,
        version: ds.version,
      },
    });
  }

  // Pipeline nodes + edges
  for (const pl of status.pipelines) {
    nodes.push({
      id: `pipeline-${pl.name}`,
      type: "pipeline",
      position: { x: 0, y: 0 },
      data: {
        label: pl.name,
        href: `/catalog/pipelines/${pl.name}`,
        version: pl.version,
        inputCount: pl.input_datasets.length,
      },
    });

    for (const input of pl.input_datasets) {
      if (!datasetNames.has(input)) continue;
      const key = `dataset-${input}->pipeline-${pl.name}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({
          id: key,
          source: `dataset-${input}`,
          target: `pipeline-${pl.name}`,
          animated: true,
        });
      }
    }

    if (pl.output_dataset && datasetNames.has(pl.output_dataset)) {
      const key = `pipeline-${pl.name}->dataset-${pl.output_dataset}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({
          id: key,
          source: `pipeline-${pl.name}`,
          target: `dataset-${pl.output_dataset}`,
          animated: true,
        });
      }
    }
  }

  // Featureset nodes + edges from extractor deps
  for (const fs of status.featuresets) {
    nodes.push({
      id: `featureset-${fs.name}`,
      type: "featureset",
      position: { x: 0, y: 0 },
      data: {
        label: fs.name,
        href: `/catalog/featuresets/${fs.name}`,
        featureCount: fs.feature_count,
      },
    });

    // Find full featureset record for extractor deps
    const full = featuresets.find((f) => f.name === fs.name);
    if (full) {
      for (const ext of full.spec.extractors) {
        for (const dep of ext.deps) {
          if (!datasetNames.has(dep)) continue;
          const key = `dataset-${dep}->featureset-${fs.name}`;
          if (!edgeSet.has(key)) {
            edgeSet.add(key);
            edges.push({
              id: key,
              source: `dataset-${dep}`,
              target: `featureset-${fs.name}`,
            });
          }
        }
      }
    }
  }

  // Apply dagre layout
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: "LR", nodesep: 70, ranksep: 160 });

  for (const node of nodes) {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const layoutNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutNodes, edges };
}
