"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchSearch } from "@/lib/api/definition";
import type { SearchParams } from "@/lib/types";

/**
 * Debounce only `q` (per TH-CAT-C4 design — keystrokes drive `q`, every other
 * filter comes from explicit clicks and applies immediately).
 */
function useDebouncedSearchParams(params: SearchParams, ms: number): SearchParams {
  const [debouncedQ, setDebouncedQ] = useState(params.q);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(params.q), ms);
    return () => clearTimeout(id);
  }, [params.q, ms]);
  return useMemo(
    () => ({ ...params, q: debouncedQ }),
    // q comes from `debouncedQ`; non-q fields applied immediately via spread.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      debouncedQ,
      params.kinds?.join(","),
      params.tags?.join(","),
      params.owners?.join(","),
      params.project,
      params.limit,
    ],
  );
}

export function useSearch(params: SearchParams) {
  const debounced = useDebouncedSearchParams(params, 200);
  return useQuery({
    queryKey: ["search", debounced],
    queryFn: () => fetchSearch(debounced),
    placeholderData: keepPreviousData,
  });
}
