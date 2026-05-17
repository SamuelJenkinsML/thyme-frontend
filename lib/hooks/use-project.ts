"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "@/lib/api/definition";

export function useProject(id: string | null | undefined) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => fetchProject(id as string),
    enabled: !!id,
  });
}
