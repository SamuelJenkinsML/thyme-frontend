import { describe, it, expect } from "vitest";
import { buildLineageGraph, COLUMN_X } from "@/lib/lineage";
import {
  makeEmptyStatus,
  makeFraudDemoStatus,
  makeFraudFeaturesets,
  makeRideshareDemoStatus,
  makeRideshareFeaturesets,
  makeCombinedStatus,
  makeCombinedFeaturesets,
} from "@/test/fixtures/status";

function nodesByType(nodes: { type?: string }[]) {
  const groups: Record<string, typeof nodes> = {};
  for (const n of nodes) {
    const t = n.type ?? "unknown";
    if (!groups[t]) groups[t] = [];
    groups[t].push(n);
  }
  return groups;
}

describe("buildLineageGraph", () => {
  it("returns empty graph for empty status", () => {
    const { nodes, edges } = buildLineageGraph(makeEmptyStatus(), []);
    // Only annotation nodes (divider, write/read labels) may exist
    const realNodes = nodes.filter((n) => n.type !== "annotation");
    expect(realNodes).toEqual([]);
    expect(edges).toEqual([]);
  });

  it("produces correct columns for fraud demo", () => {
    const { nodes, edges } = buildLineageGraph(
      makeFraudDemoStatus(),
      makeFraudFeaturesets(),
    );

    const groups = nodesByType(nodes);

    // 1 source (postgres → Order)
    expect(groups["lineageSource"]).toHaveLength(1);
    expect(groups["lineageSource"]![0].data.connectorType).toBe("postgres");

    // 2 datasets (Order, UserOrderStats)
    expect(groups["lineageDataset"]).toHaveLength(2);

    // 1 pipeline (compute_order_stats)
    expect(groups["lineagePipeline"]).toHaveLength(1);

    // 1 featureset (FraudSignals)
    expect(groups["lineageFeature"]).toHaveLength(1);

    // 1 REST API node
    expect(groups["restApi"]).toHaveLength(1);

    // Edges: source→dataset, dataset→pipeline, pipeline→dataset, dataset→featureset, featureset→restapi
    expect(edges.length).toBeGreaterThanOrEqual(5);
  });

  it("places source nodes at column 0", () => {
    const { nodes } = buildLineageGraph(
      makeFraudDemoStatus(),
      makeFraudFeaturesets(),
    );
    const sources = nodes.filter((n) => n.type === "lineageSource");
    for (const s of sources) {
      expect(s.position.x).toBe(COLUMN_X[0]);
    }
  });

  it("places dataset nodes at column 1", () => {
    const { nodes } = buildLineageGraph(
      makeFraudDemoStatus(),
      makeFraudFeaturesets(),
    );
    const datasets = nodes.filter((n) => n.type === "lineageDataset");
    for (const d of datasets) {
      expect(d.position.x).toBe(COLUMN_X[1]);
    }
  });

  it("places pipeline nodes at column 2", () => {
    const { nodes } = buildLineageGraph(
      makeFraudDemoStatus(),
      makeFraudFeaturesets(),
    );
    const pipelines = nodes.filter((n) => n.type === "lineagePipeline");
    for (const p of pipelines) {
      expect(p.position.x).toBe(COLUMN_X[2]);
    }
  });

  it("places featureset nodes at column 3", () => {
    const { nodes } = buildLineageGraph(
      makeFraudDemoStatus(),
      makeFraudFeaturesets(),
    );
    const features = nodes.filter((n) => n.type === "lineageFeature");
    for (const f of features) {
      expect(f.position.x).toBe(COLUMN_X[3]);
    }
  });

  it("places REST API node at column 4", () => {
    const { nodes } = buildLineageGraph(
      makeFraudDemoStatus(),
      makeFraudFeaturesets(),
    );
    const restApi = nodes.filter((n) => n.type === "restApi");
    expect(restApi).toHaveLength(1);
    expect(restApi[0].position.x).toBe(COLUMN_X[4]);
  });

  it("has no vertical overlaps within a column for rideshare demo", () => {
    const { nodes } = buildLineageGraph(
      makeRideshareDemoStatus(),
      makeRideshareFeaturesets(),
    );

    // Group by x position and check no y overlap
    const byX: Record<number, number[]> = {};
    for (const n of nodes) {
      if (n.type === "annotation") continue;
      const x = n.position.x;
      if (!byX[x]) byX[x] = [];
      byX[x].push(n.position.y);
    }

    for (const ys of Object.values(byX)) {
      const sorted = [...ys].sort((a, b) => a - b);
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i] - sorted[i - 1]).toBeGreaterThanOrEqual(80);
      }
    }
  });

  it("handles combined demo with all nodes", () => {
    const { nodes, edges } = buildLineageGraph(
      makeCombinedStatus(),
      makeCombinedFeaturesets(),
    );

    const groups = nodesByType(nodes);

    // 4 sources total (1 fraud + 3 rideshare)
    expect(groups["lineageSource"]).toHaveLength(4);

    // 6 datasets total
    expect(groups["lineageDataset"]).toHaveLength(6);

    // 2 pipelines
    expect(groups["lineagePipeline"]).toHaveLength(2);

    // 2 featuresets
    expect(groups["lineageFeature"]).toHaveLength(2);

    // 1 REST API node
    expect(groups["restApi"]).toHaveLength(1);

    // All featuresets connect to REST API
    const restApiEdges = edges.filter((e) => e.target === "restapi");
    expect(restApiEdges).toHaveLength(2);
  });

  it("nodes store column metadata", () => {
    const { nodes } = buildLineageGraph(
      makeFraudDemoStatus(),
      makeFraudFeaturesets(),
    );

    for (const n of nodes) {
      if (n.type === "annotation") continue;
      expect(n.data.column).toBeDefined();
      expect(typeof n.data.column).toBe("number");
    }
  });

  it("includes annotation nodes for write/read path labels", () => {
    const { nodes } = buildLineageGraph(
      makeFraudDemoStatus(),
      makeFraudFeaturesets(),
    );
    const annotations = nodes.filter((n) => n.type === "annotation");
    expect(annotations.length).toBeGreaterThanOrEqual(1);
  });

  it("creates edges from featuresets to REST API", () => {
    const { edges } = buildLineageGraph(
      makeFraudDemoStatus(),
      makeFraudFeaturesets(),
    );
    const restApiEdges = edges.filter((e) => e.target === "restapi");
    expect(restApiEdges).toHaveLength(1);
    expect(restApiEdges[0].source).toBe("feature-FraudSignals");
  });

  it("creates correct edge chain for fraud demo", () => {
    const { edges } = buildLineageGraph(
      makeFraudDemoStatus(),
      makeFraudFeaturesets(),
    );

    // source → dataset
    expect(edges.some((e) => e.source.startsWith("source-") && e.target === "dataset-Order")).toBe(true);
    // dataset → pipeline
    expect(edges.some((e) => e.source === "dataset-Order" && e.target === "pipeline-compute_order_stats")).toBe(true);
    // pipeline → dataset
    expect(edges.some((e) => e.source === "pipeline-compute_order_stats" && e.target === "dataset-UserOrderStats")).toBe(true);
    // dataset → featureset
    expect(edges.some((e) => e.source === "dataset-UserOrderStats" && e.target === "feature-FraudSignals")).toBe(true);
    // featureset → REST API
    expect(edges.some((e) => e.source === "feature-FraudSignals" && e.target === "restapi")).toBe(true);
  });
});
