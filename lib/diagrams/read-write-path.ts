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
      label: "Pipeline",
      sublabel: "Sum · Count · Avg · Min · Max",
    },
  ],
  hinge: {
    kind: "store",
    label: "Aggregated Dataset",
    sublabel: "event-time · exactly-once",
  },
  readFlow: [
    {
      kind: "transform",
      label: "Query Server",
    },
    {
      kind: "transform",
      label: "Extractor",
      sublabel: "composes features",
    },
    {
      kind: "serve",
      label: "Response",
      sublabel: "online · point-in-time",
    },
  ],
};
