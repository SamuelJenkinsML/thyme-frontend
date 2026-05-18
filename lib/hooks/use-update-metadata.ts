"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateMetadata,
  type MetadataKind,
  type MetadataPatch,
} from "@/lib/api/definition";
import type { EntityMetadata } from "@/lib/types";

interface MutationCtx {
  // Cache snapshots keyed by the query key tuple, captured for rollback.
  prev: Array<[readonly unknown[], unknown]>;
}

interface ListWithMetadata {
  metadata?: EntityMetadata;
}

// Which named entry in a list row matches the patch target.
function matchesName(
  row: { name?: string; dataset?: string },
  kind: MetadataKind,
  name: string,
): boolean {
  if (kind === "source") return row.dataset === name;
  return row.name === name;
}

/**
 * PATCH `/api/v1/metadata/{kind}/{name}` with optimistic update.
 *
 * Strategy: snapshot every cached list query whose key starts with one of
 * {`featuresets`, `datasets`, `sources`, `search`}, patch the matching row's
 * `metadata` field in place, return the snapshot from `onMutate`. On error,
 * roll back. On settle, invalidate the same families plus `owners`, `tags`,
 * `events` (facet aggregations + activity feed change with metadata).
 */
export function useUpdateMetadata(kind: MetadataKind, name: string) {
  const qc = useQueryClient();
  return useMutation<EntityMetadata, Error, MetadataPatch, MutationCtx>({
    mutationFn: (patch) => updateMetadata(kind, name, patch),

    onMutate: async (patch) => {
      const families = ["featuresets", "datasets", "sources", "search"];
      for (const family of families) {
        await qc.cancelQueries({ queryKey: [family] });
      }

      const prev: Array<[readonly unknown[], unknown]> = [];
      for (const family of families) {
        for (const [key, data] of qc.getQueriesData({ queryKey: [family] })) {
          prev.push([key, data]);
          if (Array.isArray(data)) {
            qc.setQueryData(
              key,
              data.map((row) => {
                if (
                  row &&
                  typeof row === "object" &&
                  matchesName(row as never, kind, name)
                ) {
                  const r = row as ListWithMetadata;
                  return {
                    ...row,
                    metadata: { ...(r.metadata ?? {}), ...patch },
                  };
                }
                return row;
              }),
            );
          }
        }
      }

      return { prev };
    },

    onError: (_err, _patch, ctx) => {
      if (!ctx) return;
      for (const [key, data] of ctx.prev) {
        qc.setQueryData(key, data);
      }
    },

    onSettled: () => {
      const families = [
        "featuresets",
        "datasets",
        "sources",
        "search",
        "owners",
        "tags",
        "events",
      ];
      for (const family of families) {
        qc.invalidateQueries({ queryKey: [family] });
      }
    },
  });
}
