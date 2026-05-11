import { useQuery } from "@tanstack/react-query";
import type { DependentsKind, DependentsResponse } from "@/lib/types";

async function fetchDependents(
  kind: DependentsKind,
  name: string,
): Promise<DependentsResponse> {
  const res = await fetch(
    `/api/proxy/${kind}/${encodeURIComponent(name)}/dependents`,
    { cache: "no-store" },
  );
  if (!res.ok) {
    throw new Error(`Failed to load dependents: ${res.status}`);
  }
  return res.json();
}

export function useDependents(kind: DependentsKind, name: string | null) {
  return useQuery({
    queryKey: ["dependents", kind, name],
    queryFn: () => fetchDependents(kind, name!),
    enabled: Boolean(name && name.trim().length > 0),
  });
}
