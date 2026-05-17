"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface CatalogFilters {
  q: string;
  tags: string[];
  owners: string[];
  project: string | null;
}

function parseCsv(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function readFilters(params: URLSearchParams): CatalogFilters {
  return {
    q: params.get("q") ?? "",
    tags: parseCsv(params.get("tags")),
    owners: parseCsv(params.get("owners")),
    project: params.get("project") || null,
  };
}

function writeFilters(
  params: URLSearchParams,
  filters: CatalogFilters,
): URLSearchParams {
  const next = new URLSearchParams(params);
  if (filters.q) next.set("q", filters.q);
  else next.delete("q");
  if (filters.tags.length > 0) next.set("tags", filters.tags.join(","));
  else next.delete("tags");
  if (filters.owners.length > 0) next.set("owners", filters.owners.join(","));
  else next.delete("owners");
  if (filters.project) next.set("project", filters.project);
  else next.delete("project");
  return next;
}

export function useCatalogFilters(): readonly [
  CatalogFilters,
  (patch: Partial<CatalogFilters>) => void,
] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => readFilters(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const setFilters = useCallback(
    (patch: Partial<CatalogFilters>) => {
      const current = readFilters(new URLSearchParams(searchParams.toString()));
      const merged: CatalogFilters = { ...current, ...patch };
      const next = writeFilters(
        new URLSearchParams(searchParams.toString()),
        merged,
      );
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  return [filters, setFilters] as const;
}
