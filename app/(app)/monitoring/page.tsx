"use client";

import { ExternalLink, Monitor } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { GrafanaPanel } from "@/components/grafana/grafana-panel";
import { EmptyState } from "@/components/shared/empty-state";

interface PanelConfig {
  dashboardUid: string;
  panelId: number;
  title: string;
  height: number;
}

interface Section {
  title: string;
  columns: 2 | 3;
  panels: PanelConfig[];
}

const SECTIONS: Section[] = [
  {
    title: "Golden Signals",
    columns: 3,
    panels: [
      { dashboardUid: "thyme-system-health", panelId: 2, title: "Events/sec", height: 120 },
      { dashboardUid: "thyme-system-health", panelId: 3, title: "Queries/sec", height: 120 },
      { dashboardUid: "thyme-system-health", panelId: 4, title: "Commits/min", height: 120 },
    ],
  },
  {
    title: "Latency (p95)",
    columns: 3,
    panels: [
      { dashboardUid: "thyme-system-health", panelId: 6, title: "p95 Aggregation", height: 120 },
      { dashboardUid: "thyme-system-health", panelId: 7, title: "p95 Query", height: 120 },
      { dashboardUid: "thyme-system-health", panelId: 8, title: "p95 Commit", height: 120 },
    ],
  },
  {
    title: "Throughput & Latency Over Time",
    columns: 2,
    panels: [
      { dashboardUid: "thyme-system-health", panelId: 10, title: "Engine Throughput", height: 300 },
      { dashboardUid: "thyme-system-health", panelId: 11, title: "Query Latency", height: 300 },
    ],
  },
  {
    title: "Engine Deep Dive",
    columns: 2,
    panels: [
      { dashboardUid: "thyme-engine-performance", panelId: 2, title: "Events Processed Rate", height: 300 },
      { dashboardUid: "thyme-engine-performance", panelId: 5, title: "Aggregation Latency", height: 300 },
    ],
  },
  {
    title: "Load Test",
    columns: 2,
    panels: [
      { dashboardUid: "thyme-load-test", panelId: 1, title: "Write Throughput", height: 300 },
      { dashboardUid: "thyme-load-test", panelId: 3, title: "Read Latency vs Targets", height: 300 },
    ],
  },
];

const FULL_DASHBOARD_EMBEDS = [
  { uid: "thyme-query-server", title: "Query Server Performance" },
];

export default function MonitoringPage() {
  const grafanaUrl = process.env.NEXT_PUBLIC_GRAFANA_URL;

  if (!grafanaUrl) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Monitoring</h1>
        <EmptyState
          icon={Monitor}
          title="Grafana not configured"
          description="Set NEXT_PUBLIC_GRAFANA_URL in your .env.local file to enable monitoring dashboards (e.g. http://localhost:3001)."
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Monitoring</h1>
        <a
          href={grafanaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Open Grafana
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {SECTIONS.map((section) => (
        <section key={section.title} className="space-y-3">
          <h2 className="text-lg font-semibold">{section.title}</h2>
          <div
            className={
              section.columns === 3
                ? "grid grid-cols-1 md:grid-cols-3 gap-4"
                : "grid grid-cols-1 lg:grid-cols-2 gap-4"
            }
          >
            {section.panels.map((panel) => (
              <GrafanaPanel
                key={`${panel.dashboardUid}-${panel.panelId}`}
                dashboardUid={panel.dashboardUid}
                panelId={panel.panelId}
                title={panel.title}
                height={panel.height}
              />
            ))}
          </div>
        </section>
      ))}

      {FULL_DASHBOARD_EMBEDS.map((dash) => (
        <section key={dash.uid} className="space-y-3">
          <h2 className="text-lg font-semibold">{dash.title}</h2>
          <Card>
            <CardContent className="p-0">
              <iframe
                src={`${grafanaUrl}/d/${dash.uid}/?orgId=1&theme=dark&kiosk`}
                width="100%"
                height={500}
                frameBorder="0"
                loading="lazy"
                allow="fullscreen"
                className="rounded-md"
              />
            </CardContent>
          </Card>
        </section>
      ))}
    </div>
  );
}
