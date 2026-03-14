"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchFeaturesets } from "@/lib/api/definition";

export function useFeaturesets() {
  return useQuery({
    queryKey: ["featuresets"],
    queryFn: fetchFeaturesets,
  });
}
