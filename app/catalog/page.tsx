import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeaturesetsTab } from "@/components/catalog/featuresets-tab";
import { PipelinesTab } from "@/components/catalog/pipelines-tab";
import { DatasetsTab } from "@/components/catalog/datasets-tab";

export default function CatalogPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Catalog</h1>
      <Tabs defaultValue="featuresets">
        <TabsList>
          <TabsTrigger value="featuresets">Featuresets</TabsTrigger>
          <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
          <TabsTrigger value="datasets">Datasets</TabsTrigger>
        </TabsList>
        <TabsContent value="featuresets" className="mt-4">
          <FeaturesetsTab />
        </TabsContent>
        <TabsContent value="pipelines" className="mt-4">
          <PipelinesTab />
        </TabsContent>
        <TabsContent value="datasets" className="mt-4">
          <DatasetsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
