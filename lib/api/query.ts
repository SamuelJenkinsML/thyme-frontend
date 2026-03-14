import type { FeatureQuery, FeatureResponse } from "@/lib/types";

export async function fetchFeatures(params: FeatureQuery): Promise<FeatureResponse> {
  const search = new URLSearchParams();
  search.set("entity_id", params.entity_id);
  if (params.entity_type) search.set("entity_type", params.entity_type);
  if (params.featureset) search.set("featureset", params.featureset);
  if (params.timestamp) search.set("timestamp", params.timestamp);

  const res = await fetch(`/api/proxy/features?${search.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch features: ${res.statusText}`);
  return res.json();
}
