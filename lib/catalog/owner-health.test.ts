import { describe, expect, it } from "vitest";
import { computeOwnerHealth } from "./owner-health";
import type { SearchResponse } from "@/lib/types";

const now = Date.now();
const isoAt = (msAgo: number) => new Date(now - msAgo).toISOString();

function makeFeatureset(name: string, meta: Record<string, unknown>): never;
function makeFeatureset(name: string, meta: object): SearchResponse["featuresets"][number];
function makeFeatureset(name: string, meta: object): SearchResponse["featuresets"][number] {
  return {
    id: `id_${name}`,
    name,
    spec: { name, features: [], extractors: [] },
    metadata: meta as never,
  };
}

function emptyResponse(): SearchResponse {
  return {
    featuresets: [],
    datasets: [],
    pipelines: [],
    sources: [],
    tags: [],
    owners: [],
    projects: [],
  };
}

describe("computeOwnerHealth", () => {
  it("returns zeros for an empty owner", () => {
    const h = computeOwnerHealth(emptyResponse());
    expect(h.total).toBe(0);
    expect(h.freshness).toEqual({ fresh: 0, stale: 0, broken: 0, unknown: 0 });
    expect(h.documentation).toEqual({
      hasDescription: 0,
      hasTags: 0,
      undocumented: 0,
    });
  });

  it("buckets freshness across mixed entities", () => {
    const data = emptyResponse();
    data.featuresets = [
      makeFeatureset("fresh_fs", { updated_at: isoAt(2 * 60 * 60 * 1000) }), // 2h
      makeFeatureset("stale_fs", { updated_at: isoAt(48 * 60 * 60 * 1000) }), // 2d
      makeFeatureset("broken_fs", { updated_at: isoAt(30 * 86400 * 1000) }), // 30d
      makeFeatureset("unknown_fs", {}),
    ];

    const h = computeOwnerHealth(data);
    expect(h.total).toBe(4);
    expect(h.freshness).toEqual({ fresh: 1, stale: 1, broken: 1, unknown: 1 });
  });

  it("counts documentation coverage", () => {
    const data = emptyResponse();
    data.featuresets = [
      makeFeatureset("documented", {
        description: "Explained.",
        tags: { team: "ml" },
      }),
      makeFeatureset("just_desc", { description: "Hi" }),
      makeFeatureset("just_tags", { tags: { team: "ml" } }),
      makeFeatureset("undocumented", {}),
      makeFeatureset("blank_desc", { description: "   " }), // counts as undocumented
    ];

    const h = computeOwnerHealth(data);
    expect(h.documentation.hasDescription).toBe(2);
    expect(h.documentation.hasTags).toBe(2);
    expect(h.documentation.undocumented).toBe(2); // blank_desc + undocumented
  });

  it("includes datasets and sources, ignores pipelines", () => {
    const data = emptyResponse();
    data.featuresets = [makeFeatureset("fs", { description: "x" })];
    data.datasets = [
      {
        id: "ds1",
        name: "events",
        version: 1,
        schema: {},
        primary_keys: [],
        time_field: "ts",
        metadata: { description: "events stream" },
      },
    ];
    data.sources = [
      {
        id: "src1",
        dataset: "raw",
        connector_type: "postgres",
        config: {},
        cursor_field: "",
        poll_interval: "",
        cursor_value: "",
        metadata: { tags: { source: "prod" } },
      },
    ];
    // Pipelines deliberately included to confirm they're ignored.
    data.pipelines = [
      { id: "p1", name: "p", version: 1, input_datasets: [], output_dataset: "events" },
    ];

    const h = computeOwnerHealth(data);
    expect(h.total).toBe(3); // pipeline excluded
    expect(h.documentation.hasDescription).toBe(2);
    expect(h.documentation.hasTags).toBe(1);
  });
});
