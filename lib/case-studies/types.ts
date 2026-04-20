import type { LucideIcon } from "lucide-react";

export type ArchitectureNode = {
  label: string;
  sublabel?: string;
  kind: "source" | "transform" | "store" | "serve";
};

export type ArchitectureGraph = {
  /** Optional: two sources converging into nodes[0]. Renders as a join. */
  parallelSources?: ArchitectureNode[];
  /** Downstream linear flow. */
  nodes: ArchitectureNode[];
};

export type CaseStudy = {
  slug: string;
  category: string;
  title: string;
  tagline: string;
  summary: string;
  icon: LucideIcon;
  accentColor: string;
  heroMetrics: { label: string; value: string }[];
  problem: {
    heading: string;
    body: string;
    bullets?: string[];
  };
  approach: {
    heading: string;
    body: string;
    diagram: ArchitectureGraph;
  };
  code: {
    language: "python" | "yaml";
    filename: string;
    source: string;
    caption?: string;
  };
  features: { name: string; description: string }[];
  capabilities: { label: string; value: string }[];
  personas?: { entity: string; behavior: string; expected: string }[];
  audiences?: { forEngineer: string; forBusiness: string };
  related: string[];
};
