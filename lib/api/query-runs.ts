import type { QueryRun, QueryRunsListResponse, ReplayResponse } from "@/lib/types";
import { authHeaders } from "@/lib/api/auth";

function queryBase(): string {
  if (typeof window === "undefined") {
    return process.env.QUERY_SERVER_URL ?? "http://localhost:8081";
  }
  return "";
}

function serverHeaders(): HeadersInit {
  if (typeof window !== "undefined") return {};
  return { ...authHeaders() };
}

export async function fetchQueryRuns(params?: {
  limit?: number;
  featureset?: string;
}): Promise<QueryRunsListResponse> {
  const base = queryBase();
  const qs = new URLSearchParams();
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.featureset) qs.set("featureset", params.featureset);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  const url = base
    ? `${base}/query-runs${suffix}`
    : `/api/proxy/query-runs${suffix}`;
  const res = await fetch(url, { cache: "no-store", headers: { ...serverHeaders() } });
  if (!res.ok) throw new Error(`Failed to fetch query runs: ${res.statusText}`);
  return res.json();
}

export async function fetchQueryRun(id: string): Promise<QueryRun> {
  const base = queryBase();
  const url = base
    ? `${base}/query-runs/${encodeURIComponent(id)}`
    : `/api/proxy/query-runs/${encodeURIComponent(id)}`;
  const res = await fetch(url, { cache: "no-store", headers: { ...serverHeaders() } });
  if (res.status === 404) throw new Error("Query run not found");
  if (!res.ok) throw new Error(`Failed to fetch query run: ${res.statusText}`);
  return res.json();
}

export async function replayQueryRun(id: string): Promise<ReplayResponse> {
  const base = queryBase();
  const url = base
    ? `${base}/query-runs/${encodeURIComponent(id)}/replay`
    : `/api/proxy/query-runs/${encodeURIComponent(id)}/replay`;
  const res = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: { ...serverHeaders() },
  });
  if (!res.ok) throw new Error(`Replay failed: ${res.statusText}`);
  return res.json();
}
