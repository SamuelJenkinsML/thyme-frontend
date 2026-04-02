"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/lib/api/definition";

export function useEvents(
  params?: { limit?: number; severity?: string; event_type?: string; subject?: string },
  refetchInterval?: number
) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: () => fetchEvents(params),
    refetchInterval,
  });
}
