"use client";

import Link from "next/link";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useQueryRuns } from "@/lib/hooks/use-query-runs";
import {
  hitBadge,
  kindVariant,
  previewEntities,
  relativeTime,
} from "@/lib/query-runs-utils";
import { Activity } from "lucide-react";

export default function QueryRunsPage() {
  const [featureset, setFeatureset] = useState("");
  const trimmed = featureset.trim();
  const { data, isLoading, error } = useQueryRuns({
    featureset: trimmed || undefined,
    limit: 100,
  });
  const runs = data?.runs ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Query Runs</h1>
        <Input
          placeholder="Filter by featureset"
          value={featureset}
          onChange={(e) => setFeatureset(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent runs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <EmptyState
              icon={Activity}
              title="Couldn't load query runs"
              description={(error as Error).message}
            />
          ) : runs.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No query runs yet"
              description="Run `thyme query <featureset> -e <id>` from the CLI to see it here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Featureset</TableHead>
                  <TableHead>Kind</TableHead>
                  <TableHead>Entities</TableHead>
                  <TableHead>Rows</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runs.map((run) => {
                  const hit = hitBadge(run);
                  return (
                    <TableRow key={run.id} className="cursor-pointer hover:bg-accent/30">
                      <TableCell>
                        <Link href={`/query-runs/${run.id}`} className="block">
                          {relativeTime(run.created_at)}
                        </Link>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        <Link href={`/query-runs/${run.id}`}>{run.featureset}</Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant={kindVariant(run.kind)}>{run.kind}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {previewEntities(run.entity_ids)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{hit.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{run.latency_ms}ms</TableCell>
                      <TableCell>
                        {run.error ? (
                          <Badge variant="destructive">error</Badge>
                        ) : (
                          <Badge variant="outline">ok</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
