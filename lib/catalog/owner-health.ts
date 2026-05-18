// Ownership-health computation — TH-CAT-F4. Pure derivation from a search
// response keyed to a single owner. Pipelines are omitted: they have no
// metadata column server-side (see migration 20260509000015_entity_metadata).

import type { SearchResponse } from "@/lib/types";
import { bucketFreshness, type FreshnessBucket } from "./freshness";

export interface OwnerHealth {
  total: number;
  freshness: Record<FreshnessBucket, number>;
  documentation: {
    hasDescription: number;
    hasTags: number;
    undocumented: number; // no description AND no tags
  };
}

interface MetadataBearing {
  metadata?: {
    updated_at?: string;
    description?: string | null;
    tags?: Record<string, string>;
  };
}

export function computeOwnerHealth(data: SearchResponse): OwnerHealth {
  const entities: MetadataBearing[] = [
    ...data.featuresets,
    ...data.datasets,
    ...data.sources,
  ];

  const freshness: Record<FreshnessBucket, number> = {
    fresh: 0,
    stale: 0,
    broken: 0,
    unknown: 0,
  };
  let hasDescription = 0;
  let hasTags = 0;
  let undocumented = 0;

  for (const ent of entities) {
    const bucket = bucketFreshness(ent.metadata?.updated_at);
    freshness[bucket] += 1;

    const desc = ent.metadata?.description?.trim();
    const tags = ent.metadata?.tags;
    const tagCount = tags ? Object.keys(tags).length : 0;

    if (desc) hasDescription += 1;
    if (tagCount > 0) hasTags += 1;
    if (!desc && tagCount === 0) undocumented += 1;
  }

  return {
    total: entities.length,
    freshness,
    documentation: { hasDescription, hasTags, undocumented },
  };
}
