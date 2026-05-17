"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deprecateFeatureset } from "@/lib/api/definition";
import type { DeprecateRequest } from "@/lib/types";

/**
 * Mutation hook for TH-CAT-E6. POSTs to `/featuresets/{name}/deprecate` then
 * invalidates the catalog queries that surface deprecation state — the
 * featuresets list (for card pill/strikethrough), the search results
 * (because deprecation can drive a future facet), and the recent events
 * (the backend inserts a `featureset_deprecated` event).
 */
export function useDeprecateFeatureset(name: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: DeprecateRequest) => deprecateFeatureset(name, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["featuresets"] });
      qc.invalidateQueries({ queryKey: ["search"] });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
