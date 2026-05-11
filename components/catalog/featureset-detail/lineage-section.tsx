"use client";

import Link from "next/link";
import { Database, Plug, Workflow } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineageGraph } from "@/components/catalog/lineage-graph";
import { useFeaturesets } from "@/lib/hooks/use-featuresets";
import { useSources } from "@/lib/hooks/use-sources";
import { useStatus } from "@/lib/hooks/use-status";
import { getUpstreamForFeatureset } from "@/lib/lineage-utils";

interface LineageSectionProps {
  featuresetName: string;
}

export function LineageSection({ featuresetName }: LineageSectionProps) {
  const { data: status, isLoading: statusLoading } = useStatus(30_000);
  const { data: featuresets, isLoading: featuresetsLoading } = useFeaturesets();
  const { data: sources, isLoading: sourcesLoading } = useSources();

  const isLoading = statusLoading || featuresetsLoading || sourcesLoading;

  const upstream =
    status && featuresets && sources
      ? getUpstreamForFeatureset(featuresetName, status, featuresets, sources)
      : null;

  const isEmpty =
    upstream &&
    upstream.datasets.length === 0 &&
    upstream.pipelines.length === 0 &&
    upstream.sources.length === 0;

  return (
    <section id="lineage" className="scroll-mt-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Lineage</CardTitle>
        </CardHeader>
        <CardContent>
          <LineageGraph focusFeatureset={featuresetName} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upstream</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !upstream ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-5 w-32" />
            </div>
          ) : isEmpty ? (
            <p className="text-sm italic text-muted-foreground">
              No upstream dependencies.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              <UpstreamColumn
                icon={<Plug className="h-4 w-4 text-emerald-400" />}
                label="Sources"
                items={upstream.sources.map((s) => ({
                  name: s.dataset,
                  href: `/catalog/sources/${encodeURIComponent(s.id)}`,
                  meta: s.connector_type,
                }))}
              />
              <UpstreamColumn
                icon={<Database className="h-4 w-4 text-indigo-400" />}
                label="Datasets"
                items={upstream.datasets.map((d) => ({
                  name: d.name,
                  href: `/catalog/datasets/${encodeURIComponent(d.name)}`,
                  meta: `v${d.version}`,
                }))}
              />
              <UpstreamColumn
                icon={<Workflow className="h-4 w-4 text-purple-400" />}
                label="Pipelines"
                items={upstream.pipelines.map((p) => ({
                  name: p.name,
                  href: `/catalog/pipelines/${encodeURIComponent(p.name)}`,
                  meta: `v${p.version}`,
                }))}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

interface UpstreamColumnProps {
  icon: React.ReactNode;
  label: string;
  items: { name: string; href: string; meta?: string }[];
}

function UpstreamColumn({ icon, label, items }: UpstreamColumnProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        <span>
          {label} ({items.length})
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm italic text-muted-foreground">None</p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.href} className="flex items-center justify-between gap-2 text-sm">
              <Link
                href={item.href}
                className="font-mono hover:text-foreground hover:underline"
              >
                {item.name}
              </Link>
              {item.meta && (
                <span className="font-mono text-xs text-muted-foreground">
                  {item.meta}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
