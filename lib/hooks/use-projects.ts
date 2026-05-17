"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/lib/api/definition";

export function useProjects() {
  return useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
}
