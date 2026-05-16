import type {
  EventRecord,
  FacetCount,
  FeaturesetRecord,
  JobRecord,
  SearchParams,
  SearchResponse,
  SourceRecord,
  StatusResponse,
} from "@/lib/types";
import { authHeaders } from "@/lib/api/auth";

function definitionBase(): string {
  if (typeof window === "undefined") {
    return process.env.DEFINITION_SERVICE_URL ?? "http://localhost:8080";
  }
  return "";
}

/** Auth headers for server-side direct calls (client calls go through proxy). */
function serverHeaders(): HeadersInit {
  if (typeof window !== "undefined") return {};
  return { ...authHeaders() };
}

export async function fetchFeaturesets(): Promise<FeaturesetRecord[]> {
  const base = definitionBase();
  const url = base ? `${base}/api/v1/featuresets` : "/api/proxy/featuresets";
  const res = await fetch(url, { cache: "no-store", headers: { ...serverHeaders() } });
  if (!res.ok) throw new Error(`Failed to fetch featuresets: ${res.statusText}`);
  return res.json();
}

export async function fetchJobs(): Promise<JobRecord[]> {
  const base = definitionBase();
  const url = base ? `${base}/api/v1/jobs` : "/api/proxy/jobs";
  const res = await fetch(url, { cache: "no-store", headers: { ...serverHeaders() } });
  if (!res.ok) throw new Error(`Failed to fetch jobs: ${res.statusText}`);
  return res.json();
}

export async function fetchSources(): Promise<SourceRecord[]> {
  const base = definitionBase();
  const url = base ? `${base}/api/v1/sources` : "/api/proxy/sources";
  const res = await fetch(url, { cache: "no-store", headers: { ...serverHeaders() } });
  if (!res.ok) throw new Error(`Failed to fetch sources: ${res.statusText}`);
  return res.json();
}

export async function fetchStatus(): Promise<StatusResponse> {
  const base = definitionBase();
  const url = base ? `${base}/api/v1/status` : "/api/proxy/status";
  const res = await fetch(url, { cache: "no-store", headers: { ...serverHeaders() } });
  if (!res.ok) throw new Error(`Failed to fetch status: ${res.statusText}`);
  return res.json();
}

export async function fetchEvents(params?: {
  limit?: number;
  severity?: string;
  event_type?: string;
  subject?: string;
}): Promise<EventRecord[]> {
  const base = definitionBase();
  const qs = new URLSearchParams();
  if (params?.limit) qs.set("limit", String(params.limit));
  if (params?.severity) qs.set("severity", params.severity);
  if (params?.event_type) qs.set("event_type", params.event_type);
  if (params?.subject) qs.set("subject", params.subject);
  const query = qs.toString();
  const suffix = query ? `?${query}` : "";
  const url = base ? `${base}/api/v1/events${suffix}` : `/api/proxy/events${suffix}`;
  const res = await fetch(url, { cache: "no-store", headers: { ...serverHeaders() } });
  if (!res.ok) throw new Error(`Failed to fetch events: ${res.statusText}`);
  return res.json();
}

function searchQueryString(params: SearchParams): string {
  const qs = new URLSearchParams();
  if (params.q) qs.set("q", params.q);
  if (params.kinds && params.kinds.length > 0) qs.set("kinds", params.kinds.join(","));
  if (params.tags && params.tags.length > 0) qs.set("tags", params.tags.join(","));
  if (params.owners && params.owners.length > 0) qs.set("owners", params.owners.join(","));
  if (params.project) qs.set("project", params.project);
  if (params.limit != null) qs.set("limit", String(params.limit));
  return qs.toString();
}

export async function fetchSearch(params: SearchParams): Promise<SearchResponse> {
  const base = definitionBase();
  const query = searchQueryString(params);
  const suffix = query ? `?${query}` : "";
  const url = base ? `${base}/api/v1/search${suffix}` : `/api/proxy/search${suffix}`;
  const res = await fetch(url, { cache: "no-store", headers: { ...serverHeaders() } });
  if (!res.ok) throw new Error(`Failed to fetch search: ${res.statusText}`);
  return res.json();
}

export async function fetchTags(): Promise<FacetCount[]> {
  const base = definitionBase();
  const url = base ? `${base}/api/v1/tags` : "/api/proxy/tags";
  const res = await fetch(url, { cache: "no-store", headers: { ...serverHeaders() } });
  if (!res.ok) throw new Error(`Failed to fetch tags: ${res.statusText}`);
  return res.json();
}

export async function fetchOwners(): Promise<FacetCount[]> {
  const base = definitionBase();
  const url = base ? `${base}/api/v1/owners` : "/api/proxy/owners";
  const res = await fetch(url, { cache: "no-store", headers: { ...serverHeaders() } });
  if (!res.ok) throw new Error(`Failed to fetch owners: ${res.statusText}`);
  return res.json();
}
