"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeaturesetsTab } from "@/components/catalog/featuresets-tab";
import { PipelinesTab } from "@/components/catalog/pipelines-tab";
import { DatasetsTab } from "@/components/catalog/datasets-tab";
import { CatalogSearch } from "@/components/catalog/catalog-search";
import { DependencyGraph } from "@/components/catalog/dependency-graph";
import { LineageGraph } from "@/components/catalog/lineage-graph";
import { DocsLink } from "@/components/shared/docs-link";
import { TermTooltip } from "@/components/shared/term-tooltip";
import { useSearch } from "@/lib/hooks/use-search";
import { useJobs } from "@/lib/hooks/use-jobs";

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const search = useSearch({ q: searchTerm, limit: 500 });
  const jobs = useJobs();

  const filteredJobs = useMemo(() => {
    const allJobs = jobs.data ?? [];
    if (!searchTerm.trim()) return allJobs;
    const allow = new Set((search.data?.pipelines ?? []).map((p) => p.name));
    return allJobs.filter(
      (j) => allow.has(j.name) || allow.has(j.name.replace(/_job$/, "")),
    );
  }, [jobs.data, search.data, searchTerm]);

  const pipelinesIsLoading =
    jobs.isLoading || (searchTerm.trim() !== "" && search.isLoading);

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
          <CatalogSearch value={searchTerm} onChange={setSearchTerm} />
        </div>
      </div>
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
            searchTerm={searchTerm}
          />
        </TabsContent>
        <TabsContent value="pipelines" className="mt-4">
          <PipelinesTab
            data={filteredJobs}
            isLoading={pipelinesIsLoading}
            searchTerm={searchTerm}
          />
        </TabsContent>
        <TabsContent value="datasets" className="mt-4">
          <DatasetsTab
            data={search.data?.sources ?? []}
            jobs={jobs.data ?? []}
            isLoading={search.isLoading}
            searchTerm={searchTerm}
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
