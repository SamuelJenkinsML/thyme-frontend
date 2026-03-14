"use client";

import { useState } from "react";
import { InspectForm } from "@/components/inspect/inspect-form";
import { FeatureViewer } from "@/components/inspect/feature-viewer";
import { useFeatures } from "@/lib/hooks/use-features";
import { Skeleton } from "@/components/ui/skeleton";
import type { FeatureQuery } from "@/lib/types";

export default function InspectPage() {
  const [query, setQuery] = useState<FeatureQuery | null>(null);
  const { data, isLoading, error } = useFeatures(query);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Inspect</h1>
      <InspectForm onSubmit={setQuery} />

      {isLoading && <Skeleton className="h-48 w-full rounded-lg" />}
      {error && (
        <p className="text-sm text-destructive">
          {error.message}
        </p>
      )}
      {data && <FeatureViewer response={data} />}
    </div>
  );
}
