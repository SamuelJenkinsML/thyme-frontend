"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStatus } from "@/lib/api/definition";

export function useStatus(refetchInterval?: number) {
  return useQuery({
    queryKey: ["status"],
    queryFn: fetchStatus,
    refetchInterval: refetchInterval ?? 30_000,
  });
}
