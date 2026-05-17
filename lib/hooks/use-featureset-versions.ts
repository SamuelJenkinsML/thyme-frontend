import { useQuery } from "@tanstack/react-query";
import {
  fetchFeaturesetDiff,
  fetchFeaturesetVersion,
  fetchFeaturesetVersions,
} from "@/lib/api/definition";

export function useFeaturesetVersions(name: string | null) {
  return useQuery({
    queryKey: ["featureset-versions", name],
    queryFn: () => fetchFeaturesetVersions(name!),
    enabled: Boolean(name && name.trim().length > 0),
  });
}

export function useFeaturesetVersion(name: string | null, version: number | null) {
  return useQuery({
    queryKey: ["featureset-version", name, version],
    queryFn: () => fetchFeaturesetVersion(name!, version!),
    enabled: Boolean(name && name.trim().length > 0 && version != null),
  });
}

export function useFeaturesetDiff(
  name: string | null,
  from: number | null,
  to: number | null,
) {
  return useQuery({
    queryKey: ["featureset-diff", name, from, to],
    queryFn: () => fetchFeaturesetDiff(name!, from!, to!),
    enabled: Boolean(
      name &&
        name.trim().length > 0 &&
        from != null &&
        to != null &&
        from !== to,
    ),
  });
}
