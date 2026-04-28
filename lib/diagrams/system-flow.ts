import type { ArchitectureGraph } from "@/lib/case-studies/types";

export const systemFlow: ArchitectureGraph = {
  nodes: [
    { kind: "source", label: "Your Python", sublabel: "features.py" },
    { kind: "transform", label: "Definition Service", sublabel: "stores definitions · creates topics" },
    { kind: "transform", label: "Engine", sublabel: "streaming aggregations" },
    { kind: "store", label: "Feature Store", sublabel: "event-time keyed" },
    { kind: "transform", label: "Query Server", sublabel: "runs extractors" },
    { kind: "serve", label: "Your model / app", sublabel: "online · point-in-time" },
  ],
};
