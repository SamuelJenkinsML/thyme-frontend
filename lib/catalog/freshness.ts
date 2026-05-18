// Catalog freshness bucketing — TH-CAT-F5
//
// Thresholds mirror the server-side rollup in
// `crates/definition-service/src/projects.rs` (24h fresh / 7d stale). Boundaries
// are strict less-than, matching the SQL `now() - updated_at < interval '24 hours'`.
// Keep the two in sync: if you change the policy here, change projects.rs too.

export type FreshnessBucket = "fresh" | "stale" | "broken" | "unknown";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export function bucketFreshness(
  updatedAt: string | undefined | null,
  now: Date = new Date(),
): FreshnessBucket {
  if (!updatedAt) return "unknown";
  const ts = Date.parse(updatedAt);
  if (Number.isNaN(ts)) return "unknown";
  const ageMs = now.getTime() - ts;
  if (ageMs < 0) return "fresh"; // clock skew — treat future timestamps as fresh
  if (ageMs < DAY_MS) return "fresh";
  if (ageMs < 7 * DAY_MS) return "stale";
  return "broken";
}

// Tailwind class triplet, lifted from project-stats-card.tsx so both surfaces
// stay in lockstep. `unknown` is intentionally muted — the pill component
// usually hides itself in that case anyway.
export const FRESHNESS_STYLE: Record<FreshnessBucket, string> = {
  fresh: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  stale: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  broken: "border-red-500/20 bg-red-500/10 text-red-400",
  unknown: "border-muted-foreground/20 bg-muted/30 text-muted-foreground",
};

export const FRESHNESS_LABEL: Record<FreshnessBucket, string> = {
  fresh: "Fresh",
  stale: "Stale",
  broken: "Broken",
  unknown: "Unknown",
};

// Format an ISO timestamp as a "x ago"-style relative phrase using
// Intl.RelativeTimeFormat. Falls back to the raw string if unparseable.
export function formatRelative(
  updatedAt: string | undefined | null,
  now: Date = new Date(),
): string {
  if (!updatedAt) return "never";
  const ts = Date.parse(updatedAt);
  if (Number.isNaN(ts)) return updatedAt;
  const diffSec = Math.round((ts - now.getTime()) / 1000);
  const abs = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (abs < 60) return rtf.format(diffSec, "second");
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(diffSec / 86400), "day");
  if (abs < 86400 * 365) return rtf.format(Math.round(diffSec / (86400 * 30)), "month");
  return rtf.format(Math.round(diffSec / (86400 * 365)), "year");
}
