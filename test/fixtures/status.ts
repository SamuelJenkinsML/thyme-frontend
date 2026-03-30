import type { StatusResponse, FeaturesetRecord } from "@/lib/types";

const emptyStatusBase: Omit<StatusResponse, "datasets" | "pipelines" | "featuresets" | "sources"> = {
  jobs: [],
  backfills: [],
  latest_commit: null,
  recent_events: [],
  physical_assets: [],
};

export function makeEmptyStatus(): StatusResponse {
  return {
    datasets: [],
    pipelines: [],
    featuresets: [],
    sources: [],
    ...emptyStatusBase,
  };
}

/**
 * Fraud demo: Order → compute_order_stats → UserOrderStats → FraudSignals
 * Based on ~/Projects/thyme/demos/fraud/features.py
 */
export function makeFraudDemoStatus(): StatusResponse {
  return {
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
    featuresets: [{ name: "FraudSignals", feature_count: 7 }],
    sources: [{ dataset: "Order", connector_type: "postgres" }],
    ...emptyStatusBase,
  };
}

export function makeFraudFeaturesets(): FeaturesetRecord[] {
  return [
    {
      id: "fs-fraud-001",
      name: "FraudSignals",
      spec: {
        name: "FraudSignals",
        features: [
          { name: "user_id", dtype: "str", id: 1 },
          { name: "order_count_1h", dtype: "int", id: 2 },
          { name: "order_count_24h", dtype: "int", id: 3 },
          { name: "total_spend_24h", dtype: "float", id: 4 },
          { name: "total_spend_7d", dtype: "float", id: 5 },
          { name: "max_order_amount_7d", dtype: "float", id: 6 },
          { name: "is_suspicious", dtype: "bool", id: 7 },
        ],
        extractors: [
          {
            name: "get_stats",
            inputs: ["user_id"],
            outputs: [
              "order_count_1h",
              "order_count_24h",
              "total_spend_24h",
              "total_spend_7d",
              "max_order_amount_7d",
            ],
            deps: ["UserOrderStats"],
          },
          {
            name: "compute_suspicious",
            inputs: ["order_count_1h", "total_spend_24h", "total_spend_7d"],
            outputs: ["is_suspicious"],
            deps: [],
          },
        ],
      },
    },
  ];
}

/**
 * Rideshare demo: WeatherCondition + ZoneSupply + RideRequest → compute_pricing → ZonePricingFeatures → PricingSignals
 * Based on ~/Projects/thyme/demos/rideshare/features.py
 */
export function makeRideshareDemoStatus(): StatusResponse {
  return {
    datasets: [
      { name: "WeatherCondition", version: 1 },
      { name: "ZoneSupply", version: 1 },
      { name: "RideRequest", version: 1 },
      { name: "ZonePricingFeatures", version: 1 },
    ],
    pipelines: [
      {
        name: "compute_pricing",
        version: 1,
        input_datasets: ["RideRequest", "WeatherCondition", "ZoneSupply"],
        output_dataset: "ZonePricingFeatures",
      },
    ],
    featuresets: [{ name: "PricingSignals", feature_count: 6 }],
    sources: [
      { dataset: "RideRequest", connector_type: "s3json" },
      { dataset: "WeatherCondition", connector_type: "postgres" },
      { dataset: "ZoneSupply", connector_type: "postgres" },
    ],
    ...emptyStatusBase,
  };
}

export function makeRideshareFeaturesets(): FeaturesetRecord[] {
  return [
    {
      id: "fs-rideshare-001",
      name: "PricingSignals",
      spec: {
        name: "PricingSignals",
        features: [
          { name: "zone_id", dtype: "str", id: 1 },
          { name: "ride_count_1h", dtype: "int", id: 2 },
          { name: "avg_surge_1h", dtype: "float", id: 3 },
          { name: "avg_wait_1h", dtype: "float", id: 4 },
          { name: "avg_temp_at_ride", dtype: "float", id: 5 },
          { name: "needs_surge", dtype: "bool", id: 6 },
        ],
        extractors: [
          {
            name: "get_zone_stats",
            inputs: ["zone_id"],
            outputs: [
              "ride_count_1h",
              "avg_surge_1h",
              "avg_wait_1h",
              "avg_temp_at_ride",
            ],
            deps: ["ZonePricingFeatures"],
          },
          {
            name: "compute_surge",
            inputs: ["ride_count_1h", "avg_surge_1h"],
            outputs: ["needs_surge"],
            deps: [],
          },
        ],
      },
    },
  ];
}

/**
 * Combined: both fraud + rideshare demos together
 */
export function makeCombinedStatus(): StatusResponse {
  const fraud = makeFraudDemoStatus();
  const rideshare = makeRideshareDemoStatus();
  return {
    datasets: [...fraud.datasets, ...rideshare.datasets],
    pipelines: [...fraud.pipelines, ...rideshare.pipelines],
    featuresets: [...fraud.featuresets, ...rideshare.featuresets],
    sources: [...fraud.sources, ...rideshare.sources],
    ...emptyStatusBase,
  };
}

export function makeCombinedFeaturesets(): FeaturesetRecord[] {
  return [...makeFraudFeaturesets(), ...makeRideshareFeaturesets()];
}
