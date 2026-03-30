import type { FeaturesetRecord, JobRecord, SourceRecord, StatusResponse, EventRecord } from "@/lib/types";

function definitionBase(): string {
  if (typeof window === "undefined") {
    return process.env.DEFINITION_SERVICE_URL ?? "http://localhost:8080";
  }
  return "";
}

export async function fetchFeaturesets(): Promise<FeaturesetRecord[]> {
  const base = definitionBase();
  const url = base ? `${base}/api/v1/featuresets` : "/api/proxy/featuresets";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch featuresets: ${res.statusText}`);
  return res.json();
}

export async function fetchJobs(): Promise<JobRecord[]> {
  const base = definitionBase();
  const url = base ? `${base}/api/v1/jobs` : "/api/proxy/jobs";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.statusText}`);
  return res.json();
}

export async function fetchSources(): Promise<SourceRecord[]> {
  const base = definitionBase();
  const url = base ? `${base}/api/v1/sources` : "/api/proxy/sources";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch sources: ${res.statusText}`);
  return res.json();
}

export async function fetchStatus(): Promise<StatusResponse> {
  const base = definitionBase();
  const url = base ? `${base}/api/v1/status` : "/api/proxy/status";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch status: ${res.statusText}`);
  return res.json();
}

export async function fetchEvents(params?: {
  limit?: number;
  severity?: string;
  event_type?: string;
}): Promise<EventRecord[]> {
  const base = definitionBase();
  const qs = new URLSearchParams();
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.severity) qs.set("severity", params.severity);
  if (params?.event_type) qs.set("event_type", params.event_type);
  const query = qs.toString();
  const suffix = query ? `?${query}` : "";
  const url = base ? `${base}/api/v1/events${suffix}` : `/api/proxy/events${suffix}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.statusText}`);
  return res.json();
}
