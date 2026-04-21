"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchQueryRun, fetchQueryRuns, replayQueryRun } from "@/lib/api/query-runs";

export function useQueryRuns(params?: { featureset?: string; limit?: number }) {
  return useQuery({
    queryKey: ["query-runs", params?.featureset ?? null, params?.limit ?? null],
    queryFn: () => fetchQueryRuns(params),
    refetchInterval: 10_000,
  });
}

export function useQueryRun(id: string) {
  return useQuery({
    queryKey: ["query-run", id],
    queryFn: () => fetchQueryRun(id),
    enabled: Boolean(id),
  });
}

export function useReplayQueryRun(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => replayQueryRun(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["query-runs"] });
    },
  });
}
