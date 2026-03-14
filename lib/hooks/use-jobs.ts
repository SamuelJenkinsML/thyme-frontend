"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJobs } from "@/lib/api/definition";

export function useJobs(refetchInterval?: number) {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    refetchInterval,
  });
}
