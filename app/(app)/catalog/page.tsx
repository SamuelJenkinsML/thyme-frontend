"use client";

import { Suspense, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeaturesetsTab } from "@/components/catalog/featuresets-tab";
import { PipelinesTab } from "@/components/catalog/pipelines-tab";
import { DatasetsTab } from "@/components/catalog/datasets-tab";
import { CatalogSearch } from "@/components/catalog/catalog-search";
import { DependencyGraph } from "@/components/catalog/dependency-graph";
import { LineageGraph } from "@/components/catalog/lineage-graph";
import { FacetFilters } from "@/components/catalog/facet-filters";
import { DocsLink } from "@/components/shared/docs-link";
import { TermTooltip } from "@/components/shared/term-tooltip";
import { useSearch } from "@/lib/hooks/use-search";
import { useJobs } from "@/lib/hooks/use-jobs";
import { useCatalogFilters } from "@/lib/hooks/use-catalog-filters";

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogShellFallback />}>
      <CatalogPageInner />
    </Suspense>
  );
}

function CatalogShellFallback() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Catalog</h1>
      </div>
      <p className="text-sm text-muted-foreground">Loading catalog…</p>
    </div>
  );
}

function CatalogPageInner() {
  const [filters, setFilters] = useCatalogFilters();
  const { q, tags, owners } = filters;

  const search = useSearch({ q, tags, owners, limit: 500 });
  const jobs = useJobs();

  const filteredJobs = useMemo(() => {
    const allJobs = jobs.data ?? [];
    const hasFilter = q.trim() !== "" || tags.length > 0 || owners.length > 0;
    if (!hasFilter) return allJobs;
    const allow = new Set((search.data?.pipelines ?? []).map((p) => p.name));
    return allJobs.filter(
      (j) => allow.has(j.name) || allow.has(j.name.replace(/_job$/, "")),
    );
  }, [jobs.data, search.data, q, tags, owners]);

  const hasActiveFilter =
    q.trim() !== "" || tags.length > 0 || owners.length > 0;
  const pipelinesIsLoading =
    jobs.isLoading || (hasActiveFilter && search.isLoading);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Catalog</h1>
          <TermTooltip term="featureset" />
        </div>
        <div className="flex items-center gap-4">
          <DocsLink href="/docs/concepts" className="text-xs">
            Concepts
          </DocsLink>
          <CatalogSearch
            value={q}
            onChange={(value) => setFilters({ q: value })}
          />
        </div>
      </div>
      <FacetFilters
        tags={tags}
        owners={owners}
        onTagsChange={(next) => setFilters({ tags: next })}
        onOwnersChange={(next) => setFilters({ owners: next })}
      />
      {search.error && (
        <p className="text-sm text-destructive">
          Failed to load catalog: {search.error.message}
        </p>
      )}
      {jobs.error && (
        <p className="text-sm text-destructive">
          Failed to load pipelines: {jobs.error.message}
        </p>
      )}
      <Tabs defaultValue="featuresets">
        <TabsList>
          <TabsTrigger value="featuresets">Featuresets</TabsTrigger>
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="graph">Graph</TabsTrigger>
          <TabsTrigger value="lineage">Lineage</TabsTrigger>
        </TabsList>
        <TabsContent value="featuresets" className="mt-4">
          <FeaturesetsTab
            data={search.data?.featuresets ?? []}
            isLoading={search.isLoading}
            searchTerm={q}
          />
        </TabsContent>
        <TabsContent value="pipelines" className="mt-4">
          <PipelinesTab
            data={filteredJobs}
            isLoading={pipelinesIsLoading}
            searchTerm={q}
          />
        </TabsContent>
        <TabsContent value="datasets" className="mt-4">
          <DatasetsTab
            data={search.data?.sources ?? []}
            jobs={jobs.data ?? []}
            isLoading={search.isLoading}
            searchTerm={q}
          />
        </TabsContent>
        <TabsContent value="graph" className="mt-4">
          <DependencyGraph />
        </TabsContent>
        <TabsContent value="lineage" className="mt-4">
          <LineageGraph />
        </TabsContent>
      </Tabs>
    </div>
  );
}
