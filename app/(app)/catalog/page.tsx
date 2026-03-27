"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeaturesetsTab } from "@/components/catalog/featuresets-tab";
import { PipelinesTab } from "@/components/catalog/pipelines-tab";
import { DatasetsTab } from "@/components/catalog/datasets-tab";
import { CatalogSearch } from "@/components/catalog/catalog-search";
import { DependencyGraph } from "@/components/catalog/dependency-graph";

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Catalog</h1>
        <CatalogSearch value={searchTerm} onChange={setSearchTerm} />
      </div>
      <Tabs defaultValue="featuresets">
        <TabsList>
          <TabsTrigger value="featuresets">Featuresets</TabsTrigger>
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
          <TabsTrigger value="graph">Graph</TabsTrigger>
        </TabsList>
        <TabsContent value="featuresets" className="mt-4">
          <FeaturesetsTab searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent value="pipelines" className="mt-4">
          <PipelinesTab searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent value="datasets" className="mt-4">
          <DatasetsTab searchTerm={searchTerm} />
        </TabsContent>
        <TabsContent value="graph" className="mt-4">
          <DependencyGraph />
        </TabsContent>
      </Tabs>
    </div>
  );
}
