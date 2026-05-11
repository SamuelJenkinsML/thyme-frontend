"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { FeatureDef, FeaturesetRecord } from "@/lib/types";

interface ExamplesSectionProps {
  fs: FeaturesetRecord;
}

function entityKey(features: FeatureDef[]): string {
  return features[0]?.name ?? "entity_id";
}

function onlineSnippet(className: string): string {
  return `from thyme import ThymeClient
from .featuresets import ${className}

client = ThymeClient()
result = client.query(${className}, entity_id="example_1")
print(result.df)`;
}

function offlineSnippet(className: string, key: string): string {
  return `import polars as pl
from thyme import ThymeClient
from .featuresets import ${className}

client = ThymeClient()

training_data = pl.DataFrame({
    "${key}": ["example_1", "example_2"],
    "event_ts": ["2026-01-01T00:00:00Z", "2026-01-02T00:00:00Z"],
})

result = client.query_offline(
    ${className},
    training_data,
    entity_column="${key}",
    timestamp_column="event_ts",
)
print(result.df)`;
}

function syntheticDefinition(
  className: string,
  features: FeatureDef[],
): string {
  const featureLines =
    features.length > 0
      ? features.map((f) => `    ${f.name}: ${f.dtype} = feature()`).join("\n")
      : "    entity_id: int = feature()";

  return `from thyme.featureset import featureset, feature

@featureset(
    description="...",
    owner="team@example.com",
    tags=["..."],
)
class ${className}:
${featureLines}`;
}

function definitionSnippet(fs: FeaturesetRecord): string {
  const real = fs.spec.pycode?.source_code?.trim();
  if (real) return real;
  return syntheticDefinition(fs.name, fs.spec.features ?? []);
}

interface CopyableCodeProps {
  code: string;
}

function CopyableCode({ code }: CopyableCodeProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute right-2 top-2 z-10 h-7 text-xs"
        onClick={handleCopy}
      >
        {copied ? (
          <Check className="h-3 w-3 mr-1" />
        ) : (
          <Copy className="h-3 w-3 mr-1" />
        )}
        {copied ? "Copied" : "Copy"}
      </Button>
      <CodeBlock code={code} />
    </div>
  );
}

export function ExamplesSection({ fs }: ExamplesSectionProps) {
  const features = fs.spec.features ?? [];
  const key = entityKey(features);
  const online = onlineSnippet(fs.name);
  const offline = offlineSnippet(fs.name, key);
  const definition = definitionSnippet(fs);

  return (
    <section id="examples" className="scroll-mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="online">
            <TabsList variant="line">
              <TabsTrigger value="online">Online lookup</TabsTrigger>
              <TabsTrigger value="offline">Offline / batch</TabsTrigger>
              <TabsTrigger value="definition">Definition</TabsTrigger>
            </TabsList>
            <TabsContent value="online" className="mt-4">
              <CopyableCode code={online} />
            </TabsContent>
            <TabsContent value="offline" className="mt-4">
              <CopyableCode code={offline} />
            </TabsContent>
            <TabsContent value="definition" className="mt-4">
              <CopyableCode code={definition} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
}
