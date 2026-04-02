import type { Node, Edge } from "@xyflow/react";
import type { StatusResponse, FeaturesetRecord } from "@/lib/types";

export const COLUMN_X = [0, 300, 600, 900, 1150];
const NODE_GAP = 120;
const NODE_HEIGHT = 60;

function layoutColumn(
  nodes: Node[],
  columnIndex: number,
): void {
  const x = COLUMN_X[columnIndex];
  const totalHeight = nodes.length * NODE_HEIGHT + (nodes.length - 1) * (NODE_GAP - NODE_HEIGHT);
  const startY = -totalHeight / 2;

  for (let i = 0; i < nodes.length; i++) {
    nodes[i].position = { x, y: startY + i * NODE_GAP };
    nodes[i].data = { ...nodes[i].data, column: columnIndex };
  }
}

export function buildLineageGraph(
  status: StatusResponse,
  featuresets: FeaturesetRecord[],
): { nodes: Node[]; edges: Edge[] } {
  const allNodes: Node[] = [];
  const edges: Edge[] = [];
  const edgeSet = new Set<string>();
  const datasetNames = new Set(status.datasets.map((ds) => ds.name));

  function addEdge(source: string, target: string, animated = true) {
    const key = `${source}->${target}`;
    if (edgeSet.has(key)) return;
    edgeSet.add(key);
    edges.push({ id: key, source, target, animated });
  }

  // Column 0: Source nodes
  const sourceNodes: Node[] = [];
  for (const src of status.sources) {
    const nodeId = `source-${src.dataset}-${src.connector_type}`;
    sourceNodes.push({
      id: nodeId,
      type: "lineageSource",
      position: { x: 0, y: 0 },
      data: {
        label: src.dataset,
        connectorType: src.connector_type,
        column: 0,
      },
    });

    if (datasetNames.has(src.dataset)) {
      addEdge(nodeId, `dataset-${src.dataset}`);
    }
  }

  // Column 1: Dataset nodes
  const datasetNodes: Node[] = [];
  for (const ds of status.datasets) {
    datasetNodes.push({
      id: `dataset-${ds.name}`,
      type: "lineageDataset",
      position: { x: 0, y: 0 },
      data: {
        label: ds.name,
        version: ds.version,
        href: `/catalog/datasets/${ds.name}`,
        column: 1,
      },
    });
  }

  // Column 2: Pipeline nodes
  const pipelineNodes: Node[] = [];
  for (const pl of status.pipelines) {
    pipelineNodes.push({
      id: `pipeline-${pl.name}`,
      type: "lineagePipeline",
      position: { x: 0, y: 0 },
      data: {
        label: pl.name,
        version: pl.version,
        href: `/catalog/pipelines/${pl.name}`,
        column: 2,
      },
    });

    for (const input of pl.input_datasets) {
      if (datasetNames.has(input)) {
        addEdge(`dataset-${input}`, `pipeline-${pl.name}`);
      }
    }

    if (pl.output_dataset && datasetNames.has(pl.output_dataset)) {
      addEdge(`pipeline-${pl.name}`, `dataset-${pl.output_dataset}`);
    }
  }

  // Column 3: Featureset nodes
  const featureNodes: Node[] = [];
  for (const sf of status.featuresets) {
    featureNodes.push({
      id: `feature-${sf.name}`,
      type: "lineageFeature",
      position: { x: 0, y: 0 },
      data: {
        label: sf.name,
        featureCount: sf.feature_count,
        href: `/catalog/featuresets/${sf.name}`,
        column: 3,
      },
    });

    const full = featuresets.find((f) => f.name === sf.name);
    if (full) {
      for (const ext of full.spec.extractors) {
        for (const dep of ext.deps) {
          if (datasetNames.has(dep)) {
            addEdge(`dataset-${dep}`, `feature-${sf.name}`);
          }
        }
      }
    }
  }

  // Column 4: REST API node (only if featuresets exist)
  const restApiNodes: Node[] = [];
  if (status.featuresets.length > 0) {
    restApiNodes.push({
      id: "restapi",
      type: "restApi",
      position: { x: 0, y: 0 },
      data: { label: "REST API", column: 4 },
    });

    for (const sf of status.featuresets) {
      addEdge(`feature-${sf.name}`, "restapi");
    }
  }

  // Layout each column
  layoutColumn(sourceNodes, 0);
  layoutColumn(datasetNodes, 1);
  layoutColumn(pipelineNodes, 2);
  layoutColumn(featureNodes, 3);
  layoutColumn(restApiNodes, 4);

  allNodes.push(
    ...sourceNodes,
    ...datasetNodes,
    ...pipelineNodes,
    ...featureNodes,
    ...restApiNodes,
  );

  // Annotation nodes for Write Path / Read Path labels
  if (status.sources.length > 0 || status.datasets.length > 0) {
    const dividerX = (COLUMN_X[2] + COLUMN_X[3]) / 2;
    allNodes.push({
      id: "annotation-divider",
      type: "annotation",
      position: { x: dividerX - 100, y: -200 },
      data: { label: "Write Path ▸▸          ◂◂ Read Path" },
      selectable: false,
      draggable: false,
    });
  }

  return { nodes: allNodes, edges };
}
