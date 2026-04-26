import { notFound } from "next/navigation";
import { fetchFeaturesets } from "@/lib/api/definition";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CodeBlock } from "@/components/ui/code-block";
import { ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function FeaturesetDetailPage({ params }: Props) {
  const { name } = await params;
  const featuresets = await fetchFeaturesets();
  const fs = featuresets.find((f) => f.name === decodeURIComponent(name));

  if (!fs) notFound();

  const features = fs.spec.features ?? [];
  const extractors = fs.spec.extractors ?? [];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Catalog", href: "/catalog" },
          { label: "Featuresets", href: "/catalog" },
          { label: fs.name },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">{fs.name}</h1>
        <p className="text-sm text-muted-foreground">{fs.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((f) => (
                <TableRow key={f.name}>
                  <TableCell className="font-mono">{f.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{f.dtype}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {extractors.map((ext) => (
        <Card key={ext.name}>
          <CardHeader>
            <CardTitle className="text-base">{ext.name}</CardTitle>
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <span className="font-mono">{ext.inputs.join(", ")}</span>
              <ArrowRight className="h-3 w-3" />
              <span className="font-mono">{ext.outputs.join(", ")}</span>
            </div>
            {ext.deps.length > 0 && (
              <p className="text-xs text-muted-foreground">
                depends on: {ext.deps.map((d, i) => (
                  <Badge key={i} variant="ghost" className="text-[10px] h-4 mx-0.5">{d}</Badge>
                ))}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {ext.pycode?.imports && (
              <details className="group">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  Imports
                </summary>
                <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-3 text-xs font-mono whitespace-pre">
                  {ext.pycode.imports}
                </pre>
              </details>
            )}
            {ext.pycode?.source_code && (
              <CodeBlock code={ext.pycode.source_code} />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
