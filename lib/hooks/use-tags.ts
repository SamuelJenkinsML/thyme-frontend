"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchTags } from "@/lib/api/definition";

export function useTags() {
  return useQuery({ queryKey: ["tags"], queryFn: fetchTags });
}
