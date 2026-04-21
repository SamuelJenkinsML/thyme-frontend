import type { QueryRun } from "@/lib/types";

export function kindVariant(kind: string): "default" | "secondary" | "outline" {
  if (kind === "online") return "default";
  if (kind === "batch") return "secondary";
  return "outline";
}

export interface HitBadge {
  label: string;
  color: "destructive" | "muted" | "success" | "warning";
}

export function hitBadge(run: QueryRun): HitBadge {
  if (run.error) return { label: "error", color: "destructive" };
  if (run.row_count === 0) return { label: "0 rows", color: "muted" };
  const pct = Math.round((run.hit_count / run.row_count) * 100);
  return {
    label: `${run.hit_count}/${run.row_count}`,
    color: pct === 100 ? "success" : "warning",
  };
}

export function previewEntities(ids: string[]): string {
  if (ids.length <= 3) return ids.join(", ");
  return `${ids.slice(0, 3).join(", ")} +${ids.length - 3} more`;
}

export function relativeTime(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diffSec = Math.round((now - then) / 1000);
  if (diffSec < 0) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.round(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.round(diffSec / 3600)}h ago`;
  return `${Math.round(diffSec / 86400)}d ago`;
}

export function shortRunId(id: string): string {
  return id.length > 8 ? id.slice(0, 8) : id;
}
