import type { ArchitectureNode } from "@/lib/case-studies/types";

export type ReadWriteGraph = {
  writeSources: [ArchitectureNode, ArchitectureNode];
  writeFlow: ArchitectureNode[];
  hinge: ArchitectureNode;
  readFlow: ArchitectureNode[];
};

export const readWritePath: ReadWriteGraph = {
  writeSources: [
    {
      kind: "source",
      label: "Streaming",
      sublabel: "Kafka · Kinesis",
    },
    {
      kind: "source",
      label: "Polling",
      sublabel: "Postgres · Iceberg · S3",
    },
  ],
  writeFlow: [
    {
      kind: "store",
      label: "Raw Dataset",
      sublabel: "event-time keyed",
    },
    {
      kind: "transform",
      label: "Windowed Pipeline",
      sublabel: "Sum · Count · Avg · Min · Max · ApproxPercentile",
    },
    {
      kind: "store",
      label: "Aggregated Dataset",
      sublabel: "produced by @pipeline",
    },
  ],
  hinge: {
    kind: "store",
    label: "RocksDB state",
    sublabel: "event-time keyed · exactly-once",
  },
  readFlow: [
    {
      kind: "transform",
      label: "Query Server",
      sublabel: ":8081 · HTTP",
    },
    {
      kind: "transform",
      label: "Extractor DAG",
      sublabel: "PyO3 · composes features",
    },
    {
      kind: "serve",
      label: "Featureset response",
      sublabel: "online · point-in-time",
    },
  ],
};
