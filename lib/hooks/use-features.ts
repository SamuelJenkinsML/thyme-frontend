"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFeatures } from "@/lib/api/query";
import type { FeatureQuery } from "@/lib/types";

export function useFeatures(params: FeatureQuery | null) {
  return useQuery({
    queryKey: ["features", params],
    queryFn: () => fetchFeatures(params!),
    enabled: params !== null && params.entity_id.trim() !== "",
  });
}
