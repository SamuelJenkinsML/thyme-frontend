import { describe, it, expect } from "vitest";
import { buildDependencyGraph } from "./graph";
import {
  makeEmptyStatus,
  makeFraudDemoStatus,
  makeFraudFeaturesets,
  makeRideshareDemoStatus,
  makeRideshareFeaturesets,
  makeCombinedStatus,
  makeCombinedFeaturesets,
} from "@/test/fixtures/status";
import type { StatusResponse, FeaturesetRecord } from "@/lib/types";

function findNode(nodes: { id: string }[], id: string) {
  return nodes.find((n) => n.id === id);
}

function findEdge(edges: { source: string; target: string }[], source: string, target: string) {
  return edges.find((e) => e.source === source && e.target === target);
}

describe("buildDependencyGraph", () => {
  // ── Existing behavior tests ──────────────────────────────

  it("returns empty nodes and edges for empty data", () => {
    const { nodes, edges } = buildDependencyGraph(makeEmptyStatus(), []);
    expect(nodes).toHaveLength(0);
    expect(edges).toHaveLength(0);
  });

  it("creates a single dataset node with correct properties", () => {
    const status: StatusResponse = {
      ...makeEmptyStatus(),
      datasets: [{ name: "Order", version: 1 }],
    };
    const { nodes, edges } = buildDependencyGraph(status, []);

    expect(nodes).toHaveLength(1);
    expect(nodes[0].id).toBe("dataset-Order");
    expect(nodes[0].type).toBe("dataset");
    expect(nodes[0].data.label).toBe("Order");
    expect(nodes[0].data.href).toBe("/catalog/datasets/Order");
    expect(edges).toHaveLength(0);
  });

  it("creates pipeline with input/output edges", () => {
    const status: StatusResponse = {
      ...makeEmptyStatus(),
      datasets: [
        { name: "Order", version: 1 },
        { name: "UserOrderStats", version: 1 },
      ],
      pipelines: [
        {
          name: "compute_order_stats",
          version: 1,
          input_datasets: ["Order"],
          output_dataset: "UserOrderStats",
        },
      ],
    };
    const { nodes, edges } = buildDependencyGraph(status, []);

    expect(nodes).toHaveLength(3); // 2 datasets + 1 pipeline
    expect(findNode(nodes, "pipeline-compute_order_stats")).toBeDefined();
    expect(edges).toHaveLength(2);
    expect(findEdge(edges, "dataset-Order", "pipeline-compute_order_stats")).toBeDefined();
    expect(findEdge(edges, "pipeline-compute_order_stats", "dataset-UserOrderStats")).toBeDefined();
  });

  it("creates featureset node with extractor dep edges", () => {
    const status: StatusResponse = {
      ...makeEmptyStatus(),
      datasets: [{ name: "UserOrderStats", version: 1 }],
      featuresets: [{ name: "FraudSignals", feature_count: 7 }],
    };
    const featuresets = makeFraudFeaturesets();
    const { nodes, edges } = buildDependencyGraph(status, featuresets);

    expect(findNode(nodes, "featureset-FraudSignals")).toBeDefined();
    expect(findEdge(edges, "dataset-UserOrderStats", "featureset-FraudSignals")).toBeDefined();
  });

  it("deduplicates edges from multiple extractors with same dep", () => {
    const status: StatusResponse = {
      ...makeEmptyStatus(),
      datasets: [{ name: "SharedDataset", version: 1 }],
      featuresets: [{ name: "TestFS", feature_count: 3 }],
    };
    const featuresets: FeaturesetRecord[] = [
      {
        id: "fs-test",
        name: "TestFS",
        spec: {
          name: "TestFS",
          features: [],
          extractors: [
            { name: "ext1", inputs: [], outputs: ["a"], deps: ["SharedDataset"] },
            { name: "ext2", inputs: [], outputs: ["b"], deps: ["SharedDataset"] },
          ],
        },
      },
    ];
    const { edges } = buildDependencyGraph(status, featuresets);

    const depEdges = edges.filter(
      (e) => e.source === "dataset-SharedDataset" && e.target === "featureset-TestFS",
    );
    expect(depEdges).toHaveLength(1);
  });

  it("skips output edge when output_dataset is empty", () => {
    const status: StatusResponse = {
      ...makeEmptyStatus(),
      datasets: [{ name: "Order", version: 1 }],
      pipelines: [
        {
          name: "filter_only",
          version: 1,
          input_datasets: ["Order"],
          output_dataset: "",
        },
      ],
    };
    const { edges } = buildDependencyGraph(status, []);

    expect(edges).toHaveLength(1); // only input edge
    expect(findEdge(edges, "pipeline-filter_only", "dataset-")).toBeUndefined();
  });

  // ── Full demo scenario tests ─────────────────────────────

  it("builds correct fraud demo graph", () => {
    const status = makeFraudDemoStatus();
    const featuresets = makeFraudFeaturesets();
    const { nodes, edges } = buildDependencyGraph(status, featuresets);

    // Nodes: Order, UserOrderStats, compute_order_stats, FraudSignals + source
    const datasetNodes = nodes.filter((n) => n.type === "dataset");
    const pipelineNodes = nodes.filter((n) => n.type === "pipeline");
    const featuresetNodes = nodes.filter((n) => n.type === "featureset");
    const sourceNodes = nodes.filter((n) => n.type === "source");

    expect(datasetNodes).toHaveLength(2);
    expect(pipelineNodes).toHaveLength(1);
    expect(featuresetNodes).toHaveLength(1);
    expect(sourceNodes).toHaveLength(1);

    // Edges: source→Order, Order→pipeline, pipeline→UserOrderStats, UserOrderStats→FraudSignals
    expect(edges).toHaveLength(4);
    expect(findEdge(edges, "dataset-Order", "pipeline-compute_order_stats")).toBeDefined();
    expect(findEdge(edges, "pipeline-compute_order_stats", "dataset-UserOrderStats")).toBeDefined();
    expect(findEdge(edges, "dataset-UserOrderStats", "featureset-FraudSignals")).toBeDefined();
  });

  it("builds correct rideshare demo graph", () => {
    const status = makeRideshareDemoStatus();
    const featuresets = makeRideshareFeaturesets();
    const { nodes, edges } = buildDependencyGraph(status, featuresets);

    const datasetNodes = nodes.filter((n) => n.type === "dataset");
    const pipelineNodes = nodes.filter((n) => n.type === "pipeline");
    const featuresetNodes = nodes.filter((n) => n.type === "featureset");
    const sourceNodes = nodes.filter((n) => n.type === "source");

    expect(datasetNodes).toHaveLength(4);
    expect(pipelineNodes).toHaveLength(1);
    expect(featuresetNodes).toHaveLength(1);
    expect(sourceNodes).toHaveLength(3);

    // 3 input edges + 1 output edge + 1 featureset dep + 3 source edges = 8
    expect(edges).toHaveLength(8);
  });

  it("builds correct combined multi-demo graph", () => {
    const status = makeCombinedStatus();
    const featuresets = makeCombinedFeaturesets();
    const { nodes, edges } = buildDependencyGraph(status, featuresets);

    const datasetNodes = nodes.filter((n) => n.type === "dataset");
    const pipelineNodes = nodes.filter((n) => n.type === "pipeline");
    const featuresetNodes = nodes.filter((n) => n.type === "featureset");
    const sourceNodes = nodes.filter((n) => n.type === "source");

    expect(datasetNodes).toHaveLength(6); // 2 fraud + 4 rideshare
    expect(pipelineNodes).toHaveLength(2);
    expect(featuresetNodes).toHaveLength(2);
    expect(sourceNodes).toHaveLength(4); // 1 fraud + 3 rideshare

    // fraud: 4 edges, rideshare: 8 edges = 12 total
    expect(edges).toHaveLength(12);
  });

  // ── New feature: source nodes ────────────────────────────

  it("creates source nodes from status.sources", () => {
    const status: StatusResponse = {
      ...makeEmptyStatus(),
      datasets: [{ name: "Order", version: 1 }],
      sources: [{ dataset: "Order", connector_type: "postgres" }],
    };
    const { nodes, edges } = buildDependencyGraph(status, []);

    const sourceNode = findNode(nodes, "source-Order-postgres");
    expect(sourceNode).toBeDefined();
    expect(sourceNode!.type).toBe("source");
    expect(sourceNode!.data.label).toBe("Order");
    expect(sourceNode!.data.connectorType).toBe("postgres");

    expect(findEdge(edges, "source-Order-postgres", "dataset-Order")).toBeDefined();
  });

  // ── New feature: node metadata ───────────────────────────

  it("includes version metadata on dataset nodes", () => {
    const status: StatusResponse = {
      ...makeEmptyStatus(),
      datasets: [{ name: "Order", version: 3 }],
    };
    const { nodes } = buildDependencyGraph(status, []);
    const node = findNode(nodes, "dataset-Order");
    expect(node!.data.version).toBe(3);
  });

  it("includes version and inputCount metadata on pipeline nodes", () => {
    const status: StatusResponse = {
      ...makeEmptyStatus(),
      datasets: [
        { name: "A", version: 1 },
        { name: "B", version: 1 },
        { name: "C", version: 1 },
      ],
      pipelines: [
        { name: "p1", version: 2, input_datasets: ["A", "B"], output_dataset: "C" },
      ],
    };
    const { nodes } = buildDependencyGraph(status, []);
    const node = findNode(nodes, "pipeline-p1");
    expect(node!.data.version).toBe(2);
    expect(node!.data.inputCount).toBe(2);
  });

  it("includes featureCount metadata on featureset nodes", () => {
    const status: StatusResponse = {
      ...makeEmptyStatus(),
      featuresets: [{ name: "FraudSignals", feature_count: 7 }],
    };
    const { nodes } = buildDependencyGraph(status, []);
    const node = findNode(nodes, "featureset-FraudSignals");
    expect(node!.data.featureCount).toBe(7);
  });

  // ── Edge case: dangling references ───────────────────────

  it("skips edges to nonexistent datasets", () => {
    const status: StatusResponse = {
      ...makeEmptyStatus(),
      datasets: [], // no datasets defined
      pipelines: [
        {
          name: "orphan_pipeline",
          version: 1,
          input_datasets: ["MissingDataset"],
          output_dataset: "AlsoMissing",
        },
      ],
    };
    const { nodes, edges } = buildDependencyGraph(status, []);

    expect(nodes).toHaveLength(1); // just the pipeline
    expect(edges).toHaveLength(0); // no valid edges
  });
});
