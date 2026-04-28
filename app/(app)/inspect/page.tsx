"use client";

import { useState } from "react";
import { InspectForm } from "@/components/inspect/inspect-form";
import { FeatureViewer } from "@/components/inspect/feature-viewer";
import { useFeatures } from "@/lib/hooks/use-features";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { DocsLink } from "@/components/shared/docs-link";
import { TermTooltip } from "@/components/shared/term-tooltip";
import { Search } from "lucide-react";
import type { FeatureQuery } from "@/lib/types";

export default function InspectPage() {
  const [query, setQuery] = useState<FeatureQuery | null>(null);
  const { data, isLoading, error } = useFeatures(query);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Inspect</h1>
        <TermTooltip term="featureset" />
      </div>
      <InspectForm onSubmit={setQuery} />

      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {error && (
        <p className="text-sm text-destructive">
          {error.message}
        </p>
      )}
      {data && <FeatureViewer response={data} />}
      {!query && !data && !isLoading && (
        <EmptyState
          icon={Search}
          title="Inspect Feature Values"
          description="Enter an entity ID to inspect feature values. Optionally select a featureset and timestamp."
          action={<DocsLink href="/docs/concepts/featuresets">Learn about featuresets</DocsLink>}
        />
      )}
    </div>
  );
}
