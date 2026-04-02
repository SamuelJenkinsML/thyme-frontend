import { describe, it, expect } from "vitest";
import {
  getDownstreamFromDataset,
  getUpstreamForFeatureset,
  getDownstreamFromSource,
} from "@/lib/lineage-utils";
import {
  makeEmptyStatus,
  makeFraudDemoStatus,
  makeFraudFeaturesets,
  makeRideshareDemoStatus,
  makeRideshareFeaturesets,
  makeCombinedStatus,
  makeCombinedFeaturesets,
} from "@/test/fixtures/status";

describe("getDownstreamFromDataset", () => {
  it("returns empty results for empty status", () => {
    const result = getDownstreamFromDataset("Order", makeEmptyStatus(), []);
    expect(result.pipelines).toEqual([]);
    expect(result.outputDatasets).toEqual([]);
    expect(result.featuresets).toEqual([]);
  });

  it("returns empty results for non-existent dataset", () => {
    const result = getDownstreamFromDataset(
      "NonExistent",
      makeFraudDemoStatus(),
      makeFraudFeaturesets(),
    );
    expect(result.pipelines).toEqual([]);
    expect(result.outputDatasets).toEqual([]);
    expect(result.featuresets).toEqual([]);
  });

  it("finds consuming pipelines and their output datasets for Order", () => {
    const status = makeFraudDemoStatus();
    const featuresets = makeFraudFeaturesets();
    const result = getDownstreamFromDataset("Order", status, featuresets);

    expect(result.pipelines).toHaveLength(1);
    expect(result.pipelines[0].name).toBe("compute_order_stats");
    expect(result.outputDatasets).toHaveLength(1);
    expect(result.outputDatasets[0].name).toBe("UserOrderStats");
  });

  it("finds derived featuresets for UserOrderStats", () => {
    const status = makeFraudDemoStatus();
    const featuresets = makeFraudFeaturesets();
    const result = getDownstreamFromDataset("UserOrderStats", status, featuresets);

    // UserOrderStats is not an input to any pipeline, but FraudSignals depends on it
    expect(result.pipelines).toEqual([]);
    expect(result.featuresets).toHaveLength(1);
    expect(result.featuresets[0].name).toBe("FraudSignals");
  });

  it("handles rideshare demo with multiple input datasets", () => {
    const status = makeRideshareDemoStatus();
    const featuresets = makeRideshareFeaturesets();

    // RideRequest is one of 3 inputs to compute_pricing
    const result = getDownstreamFromDataset("RideRequest", status, featuresets);
    expect(result.pipelines).toHaveLength(1);
    expect(result.pipelines[0].name).toBe("compute_pricing");
    expect(result.outputDatasets).toHaveLength(1);
    expect(result.outputDatasets[0].name).toBe("ZonePricingFeatures");
  });

  it("finds featuresets in combined status", () => {
    const status = makeCombinedStatus();
    const featuresets = makeCombinedFeaturesets();
    const result = getDownstreamFromDataset("ZonePricingFeatures", status, featuresets);

    expect(result.featuresets).toHaveLength(1);
    expect(result.featuresets[0].name).toBe("PricingSignals");
  });
});

describe("getUpstreamForFeatureset", () => {
  it("returns empty results for empty status", () => {
    const result = getUpstreamForFeatureset("FraudSignals", makeEmptyStatus(), [], []);
    expect(result.datasets).toEqual([]);
    expect(result.pipelines).toEqual([]);
    expect(result.sources).toEqual([]);
  });

  it("returns empty results for non-existent featureset", () => {
    const result = getUpstreamForFeatureset(
      "NonExistent",
      makeFraudDemoStatus(),
      makeFraudFeaturesets(),
      [{ id: "s1", dataset: "Order", connector_type: "postgres", config: {}, cursor_field: "ts", poll_interval: "1m", cursor_value: "" }],
    );
    expect(result.datasets).toEqual([]);
    expect(result.pipelines).toEqual([]);
    expect(result.sources).toEqual([]);
  });

  it("traces upstream from FraudSignals to datasets and sources", () => {
    const status = makeFraudDemoStatus();
    const featuresets = makeFraudFeaturesets();
    const sources = [
      { id: "s1", dataset: "Order", connector_type: "postgres", config: {}, cursor_field: "ts", poll_interval: "1m", cursor_value: "" },
    ];
    const result = getUpstreamForFeatureset("FraudSignals", status, featuresets, sources);

    // FraudSignals depends on UserOrderStats (via extractor deps)
    expect(result.datasets).toHaveLength(1);
    expect(result.datasets[0].name).toBe("UserOrderStats");

    // UserOrderStats is produced by compute_order_stats
    expect(result.pipelines).toHaveLength(1);
    expect(result.pipelines[0].name).toBe("compute_order_stats");

    // compute_order_stats takes Order as input, which has a postgres source
    expect(result.sources).toHaveLength(1);
    expect(result.sources[0].dataset).toBe("Order");
  });

  it("traces upstream for PricingSignals in rideshare demo", () => {
    const status = makeRideshareDemoStatus();
    const featuresets = makeRideshareFeaturesets();
    const sources = [
      { id: "s1", dataset: "RideRequest", connector_type: "s3json", config: {}, cursor_field: "ts", poll_interval: "1m", cursor_value: "" },
      { id: "s2", dataset: "WeatherCondition", connector_type: "postgres", config: {}, cursor_field: "ts", poll_interval: "5m", cursor_value: "" },
      { id: "s3", dataset: "ZoneSupply", connector_type: "postgres", config: {}, cursor_field: "ts", poll_interval: "1m", cursor_value: "" },
    ];
    const result = getUpstreamForFeatureset("PricingSignals", status, featuresets, sources);

    // PricingSignals depends on ZonePricingFeatures
    expect(result.datasets).toHaveLength(1);
    expect(result.datasets[0].name).toBe("ZonePricingFeatures");

    // ZonePricingFeatures is produced by compute_pricing
    expect(result.pipelines).toHaveLength(1);
    expect(result.pipelines[0].name).toBe("compute_pricing");

    // compute_pricing takes 3 inputs, all with sources
    expect(result.sources).toHaveLength(3);
  });
});

describe("getDownstreamFromSource", () => {
  it("returns empty results for empty status", () => {
    const result = getDownstreamFromSource("Order", "postgres", makeEmptyStatus(), []);
    expect(result.dataset).toBeNull();
    expect(result.pipelines).toEqual([]);
    expect(result.outputDatasets).toEqual([]);
    expect(result.featuresets).toEqual([]);
  });

  it("traces full downstream chain from postgres source in fraud demo", () => {
    const status = makeFraudDemoStatus();
    const featuresets = makeFraudFeaturesets();
    const result = getDownstreamFromSource("Order", "postgres", status, featuresets);

    expect(result.dataset).not.toBeNull();
    expect(result.dataset!.name).toBe("Order");
    expect(result.pipelines).toHaveLength(1);
    expect(result.pipelines[0].name).toBe("compute_order_stats");
    expect(result.outputDatasets).toHaveLength(1);
    expect(result.outputDatasets[0].name).toBe("UserOrderStats");
    expect(result.featuresets).toHaveLength(1);
    expect(result.featuresets[0].name).toBe("FraudSignals");
  });

  it("traces from s3json source in rideshare demo", () => {
    const status = makeRideshareDemoStatus();
    const featuresets = makeRideshareFeaturesets();
    const result = getDownstreamFromSource("RideRequest", "s3json", status, featuresets);

    expect(result.dataset).not.toBeNull();
    expect(result.dataset!.name).toBe("RideRequest");
    expect(result.pipelines).toHaveLength(1);
    expect(result.outputDatasets).toHaveLength(1);
    expect(result.outputDatasets[0].name).toBe("ZonePricingFeatures");
    expect(result.featuresets).toHaveLength(1);
    expect(result.featuresets[0].name).toBe("PricingSignals");
  });

  it("returns null dataset for non-existent source dataset", () => {
    const result = getDownstreamFromSource("NonExistent", "postgres", makeFraudDemoStatus(), makeFraudFeaturesets());
    expect(result.dataset).toBeNull();
  });
});
