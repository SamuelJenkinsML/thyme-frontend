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
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-mono">{f.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{f.dtype}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{f.id}</TableCell>
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
            <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
              <span>inputs: {ext.inputs.join(", ")}</span>
              <span>·</span>
              <span>outputs: {ext.outputs.join(", ")}</span>
            </div>
          </CardHeader>
          {ext.pycode?.source_code && (
            <CardContent>
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs text-foreground font-mono whitespace-pre">
                {ext.pycode.source_code}
              </pre>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}
