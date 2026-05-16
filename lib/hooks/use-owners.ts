"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchOwners } from "@/lib/api/definition";

export function useOwners() {
  return useQuery({ queryKey: ["owners"], queryFn: fetchOwners });
}
