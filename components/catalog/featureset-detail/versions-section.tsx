"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFeaturesetVersions } from "@/lib/hooks/use-featureset-versions";

interface VersionsSectionProps {
  featuresetName: string;
}

function formatCreatedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function VersionsSection({ featuresetName }: VersionsSectionProps) {
  const { data, isLoading, error } = useFeaturesetVersions(featuresetName);

  return (
    <section id="versions" className="scroll-mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Versions</CardTitle>
          <CardDescription>
            Every commit that mutated this featureset&apos;s spec produces a
            new version. Metadata-only edits (tags, owner, description) do not
            bump the version.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">
              Failed to load versions: {error.message}
            </p>
          ) : !data || data.versions.length === 0 ? (
            <p className="text-sm italic text-muted-foreground">
              No version history yet. The first version will appear after the
              next commit that mutates this featureset&apos;s spec.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Compare</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.versions.map((v, idx) => {
                  const isLatest = idx === 0;
                  return (
                    <TableRow key={v.version}>
                      <TableCell className="font-mono">
                        <Link
                          href={`/catalog/featuresets/${encodeURIComponent(
                            featuresetName,
                          )}/versions/${v.version}`}
                          className="hover:text-foreground hover:underline"
                        >
                          v{v.version}
                        </Link>
                        {isLatest && (
                          <Badge
                            variant="outline"
                            className="ml-2 text-[10px]"
                          >
                            latest
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatCreatedAt(v.created_at)}
                      </TableCell>
                      <TableCell>
                        {v.parent_version != null ? (
                          <Link
                            href={`/catalog/featuresets/${encodeURIComponent(
                              featuresetName,
                            )}/diff?from=${v.parent_version}&to=${v.version}`}
                            className="text-sm hover:text-foreground hover:underline"
                          >
                            v{v.parent_version} → v{v.version}
                          </Link>
                        ) : (
                          <span className="text-sm italic text-muted-foreground">
                            initial
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
