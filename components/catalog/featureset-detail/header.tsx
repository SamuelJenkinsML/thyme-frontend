import Link from "next/link";
import { AlertTriangle, Calendar } from "lucide-react";
import { FreshnessPill } from "@/components/catalog/freshness-pill";
import { OwnerChip } from "@/components/catalog/owner-chip";
import { TagChipList } from "@/components/catalog/tag-chip-list";
import type { FeaturesetRecord } from "@/lib/types";

interface FeaturesetDetailHeaderProps {
  fs: FeaturesetRecord;
}

function formatUpdatedAt(updatedAt?: string): string | null {
  if (!updatedAt) return null;
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FeaturesetDetailHeader({ fs }: FeaturesetDetailHeaderProps) {
  const metadata = fs.metadata;
  const isDeprecated = Boolean(metadata?.deprecated_at) || metadata?.deprecated === true;
  const updatedAt = formatUpdatedAt(metadata?.updated_at);
  const hasMetaRow =
    Boolean(metadata?.owner) ||
    Object.keys(metadata?.tags ?? {}).length > 0 ||
    Boolean(updatedAt);

  return (
    <div className="space-y-3">
      {isDeprecated && (
        <div className="flex items-start gap-2 rounded-md border border-yellow-500/40 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="space-y-1">
            <p className="font-medium">This featureset is deprecated.</p>
            {metadata?.deprecation_reason && (
              <p className="text-yellow-200/80">{metadata.deprecation_reason}</p>
            )}
            {metadata?.replacement && (
              <p>
                Use{" "}
                <Link
                  href={`/catalog/featuresets/${encodeURIComponent(metadata.replacement)}`}
                  className="underline underline-offset-2 hover:text-yellow-100"
                >
                  {metadata.replacement}
                </Link>{" "}
                instead.
              </p>
            )}
          </div>
        </div>
      )}

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-thyme-leaf">
          Featureset
        </p>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
          <span className="inline-block size-2 rounded-sm bg-emerald-400/80" aria-hidden />
          {fs.name}
        </h1>
        <p className="font-mono text-sm text-muted-foreground">{fs.id}</p>
      </div>

      {hasMetaRow && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <OwnerChip owner={metadata?.owner} />
          <TagChipList tags={metadata?.tags} />
          {updatedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Updated {updatedAt}</span>
            </span>
          )}
          <FreshnessPill updatedAt={metadata?.updated_at} size="md" />
        </div>
      )}
    </div>
  );
}
