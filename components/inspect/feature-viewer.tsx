"use client";

import type { FeatureResponse } from "@/lib/types";
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

function renderValue(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }
  if (typeof value === "boolean") {
    return (
      <Badge variant={value ? "default" : "secondary"}>
        {value ? "true" : "false"}
      </Badge>
    );
  }
  if (typeof value === "number") {
    return <span className="font-mono text-right tabular-nums">{value}</span>;
  }
  return <span className="font-mono text-xs">{JSON.stringify(value)}</span>;
}

function inferType(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number") return Number.isInteger(value) ? "int" : "float";
  if (typeof value === "string") return "str";
  return typeof value;
}

interface FeatureViewerProps {
  response: FeatureResponse;
}

export function FeatureViewer({ response }: FeatureViewerProps) {
  const entries = Object.entries(response.features ?? {});

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base">
            {response.entity_type} · <span className="font-mono">{response.entity_id}</span>
          </CardTitle>
          <Badge variant={response.mode === "online" ? "default" : "secondary"}>
            {response.mode}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No features returned.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map(([key, val]) => (
                <TableRow key={key}>
                  <TableCell className="font-mono text-sm">{key}</TableCell>
                  <TableCell>{renderValue(val)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{inferType(val)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
