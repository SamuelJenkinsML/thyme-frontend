import type { ArchitectureGraph } from "@/lib/case-studies/types";

export const conceptFlow: ArchitectureGraph = {
  nodes: [
    { kind: "source", label: "Source", sublabel: "Postgres · Kafka · Iceberg" },
    { kind: "store", label: "Raw Dataset", sublabel: "@dataset" },
    { kind: "transform", label: "Pipeline", sublabel: "groupby · aggregate" },
    { kind: "store", label: "Aggregated Dataset", sublabel: "windowed stats" },
    { kind: "serve", label: "Featureset", sublabel: "@extractor · model features" },
  ],
};
