import type { ArchitectureGraph } from "@/lib/case-studies/types";

export const experienceDiscoveryFlow: ArchitectureGraph = {
  parallelSources: [
    { kind: "source", label: "Click events", sublabel: "Kinesis · 5k EPS" },
    { kind: "source", label: "User profile", sublabel: "Postgres" },
  ],
  nodes: [
    { kind: "transform", label: "Temporal join + windows", sublabel: "1h · 24h · 7d" },
    { kind: "store", label: "UserEngagementStats", sublabel: "9 raw aggregates" },
    { kind: "transform", label: "Python extractor", sublabel: "composite signals" },
    { kind: "serve", label: "DiscoverySignals", sublabel: "15 features served" },
  ],
};
