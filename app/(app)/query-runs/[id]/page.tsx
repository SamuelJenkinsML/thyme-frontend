"use client";

import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CodeBlock } from "@/components/ui/code-block";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryRun, useReplayQueryRun } from "@/lib/hooks/use-query-runs";
import { shortRunId } from "@/lib/query-runs-utils";

interface Props {
  params: Promise<{ id: string }>;
}

const shortId = shortRunId;

export default function QueryRunDetailPage({ params }: Props) {
  const { id } = use(params);
  const { data: run, isLoading, error } = useQueryRun(id);
  const replay = useReplayQueryRun(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="space-y-4">
        <Breadcrumb
          items={[{ label: "Query Runs", href: "/query-runs" }, { label: shortId(id) }]}
        />
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Query run not found."}
          </CardContent>
        </Card>
      </div>
    );
  }

  const replayData = replay.data;

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Query Runs", href: "/query-runs" },
          { label: shortId(run.id) },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{run.featureset}</h1>
          <p className="text-sm text-muted-foreground font-mono">{run.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{run.kind}</Badge>
          {run.error ? (
            <Badge variant="destructive">error</Badge>
          ) : (
            <Badge variant="outline">ok</Badge>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Created</dt>
              <dd className="font-mono text-xs">{run.created_at}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Requested timestamp</dt>
              <dd className="font-mono text-xs">{run.requested_timestamp ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Rows</dt>
              <dd>{run.row_count}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Hits</dt>
              <dd>{run.hit_count}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Latency</dt>
              <dd>{run.latency_ms}ms</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">API key fingerprint</dt>
              <dd className="font-mono text-xs">{run.api_key_fingerprint ?? "—"}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted-foreground">Entity IDs</dt>
              <dd className="font-mono text-xs break-all">
                {run.entity_ids.join(", ")}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {run.error && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-xs text-destructive/90">{run.error}</pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Feature values</CardTitle>
          <p className="text-xs text-muted-foreground">
            Values aren&apos;t persisted. Click Replay to re-execute and show the current result.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => replay.mutate()}
            disabled={replay.isPending || Boolean(run.error)}
          >
            {replay.isPending ? "Replaying…" : "Replay"}
          </Button>
          {replay.error && (
            <p className="text-xs text-destructive">{(replay.error as Error).message}</p>
          )}
          {replayData && (
            <CodeBlock code={JSON.stringify(replayData.result, null, 2)} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
