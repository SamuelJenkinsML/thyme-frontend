import type { FeaturesetRecord, JobRecord, SourceRecord, StatusResponse } from "@/lib/types";

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
