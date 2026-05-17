"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFeaturesetVersions } from "@/lib/hooks/use-featureset-versions";

interface VersionSelectorProps {
  featuresetName: string;
  /** The version currently being viewed, or "latest" when on the canonical
   *  detail page. */
  currentVersion?: number | "latest";
}

const LATEST = "latest" as const;

export function VersionSelector({
  featuresetName,
  currentVersion = LATEST,
}: VersionSelectorProps) {
  const router = useRouter();
  const { data, isLoading } = useFeaturesetVersions(featuresetName);

  // Don't render the selector when there's no history yet — avoids an
  // empty-dropdown noise pattern on freshly committed featuresets.
  if (!isLoading && (!data || data.versions.length === 0)) {
    return null;
  }

  const value = currentVersion === LATEST ? LATEST : String(currentVersion);

  function onValueChange(next: string | string[] | null) {
    if (typeof next !== "string") return;
    if (next === LATEST) {
      router.push(`/catalog/featuresets/${encodeURIComponent(featuresetName)}`);
    } else {
      router.push(
        `/catalog/featuresets/${encodeURIComponent(featuresetName)}/versions/${next}`,
      );
    }
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        size="sm"
        aria-label="Featureset version"
        className="min-w-32"
      >
        <SelectValue placeholder={isLoading ? "Loading…" : "Version"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={LATEST}>Latest</SelectItem>
        {data?.versions.map((v) => (
          <SelectItem key={v.version} value={String(v.version)}>
            v{v.version}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
