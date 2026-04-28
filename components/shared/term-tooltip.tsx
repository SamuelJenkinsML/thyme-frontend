"use client";

import Link from "next/link";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TERMS = {
  featureset: {
    label: "Featureset",
    gloss:
      "A collection of model-ready features composed from datasets, with optional Python extractors for derived features.",
    href: "/docs/concepts/featuresets",
  },
  extractor: {
    label: "Extractor",
    gloss:
      "A function that derives a feature value from raw aggregated state. Runs at query time inside the query server.",
    href: "/docs/concepts/featuresets#extractors",
  },
  extractorKind: {
    label: "ExtractorKind",
    gloss:
      "PY_FUNC for Python-defined extractors, LOOKUP for auto-generated direct dataset reads.",
    href: "/docs/concepts/featuresets",
  },
  maxLateness: {
    label: "max_lateness",
    gloss:
      "The bound on how late an event may arrive (relative to its event time) and still be incorporated into windowed aggregations.",
    href: "/docs/architecture/durability-and-consistency#watermarks-and-max_lateness",
  },
  pipeline: {
    label: "Pipeline",
    gloss:
      "A windowed aggregation defined with @pipeline. Reads from one or more datasets and writes a single output dataset.",
    href: "/docs/concepts/pipelines",
  },
  source: {
    label: "Source",
    gloss:
      "A connector that feeds raw events into a dataset (Postgres, Kafka, Kinesis, S3, Iceberg, Snowflake, BigQuery).",
    href: "/docs/integrations",
  },
  queryRun: {
    label: "Query Run",
    gloss:
      "An audit record of a CLI or SDK query - entity IDs, latency, hit count, API key fingerprint, error.",
    href: "/docs/concepts/query-runs",
  },
} as const;

interface TermTooltipProps {
  term: keyof typeof TERMS;
  children?: React.ReactNode;
}

export function TermTooltip({ term, children }: TermTooltipProps) {
  const entry = TERMS[term];
  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          aria-label={`What is a ${entry.label}?`}
        >
          {children ?? <HelpCircle className="h-3.5 w-3.5" aria-hidden />}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs flex-col items-start gap-2 text-left">
          <p className="text-xs leading-snug">{entry.gloss}</p>
          <Link
            href={entry.href}
            className="text-xs font-medium underline underline-offset-2"
          >
            Read more →
          </Link>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
