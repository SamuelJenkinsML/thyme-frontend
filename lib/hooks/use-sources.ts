"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSources } from "@/lib/api/definition";

export function useSources() {
  return useQuery({
    queryKey: ["sources"],
    queryFn: fetchSources,
  });
}
