import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VersionSelector } from "@/components/catalog/featureset-detail/version-selector";
import { fetchFeaturesetVersion } from "@/lib/api/definition";

interface Props {
  params: Promise<{ name: string; v: string }>;
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

export default async function FeaturesetVersionPage({ params }: Props) {
  const { name, v } = await params;
  const versionNum = Number.parseInt(v, 10);
  if (!Number.isFinite(versionNum)) notFound();

  const decoded = decodeURIComponent(name);
  let detail;
  try {
    detail = await fetchFeaturesetVersion(decoded, versionNum);
  } catch {
    notFound();
  }

  const features = detail.spec.features ?? [];
  const extractors = detail.spec.extractors ?? [];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Catalog", href: "/catalog" },
          { label: "Featuresets", href: "/catalog" },
          {
            label: decoded,
            href: `/catalog/featuresets/${encodeURIComponent(decoded)}`,
          },
          { label: `v${detail.version}` },
        ]}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-thyme-leaf">
            Featureset · historical version
          </p>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
            <span className="inline-block size-2 rounded-sm bg-amber-400/80" aria-hidden />
            {decoded}
            <Badge variant="outline" className="text-xs">
              v{detail.version}
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground">
            Committed {formatCreatedAt(detail.created_at)}
            {detail.parent_version != null && (
              <>
                {" · parent "}
                <Link
                  href={`/catalog/featuresets/${encodeURIComponent(decoded)}/versions/${detail.parent_version}`}
                  className="hover:text-foreground hover:underline"
                >
                  v{detail.parent_version}
                </Link>
                {" · "}
                <Link
                  href={`/catalog/featuresets/${encodeURIComponent(decoded)}/diff?from=${detail.parent_version}&to=${detail.version}`}
                  className="hover:text-foreground hover:underline"
                >
                  compare with v{detail.parent_version}
                </Link>
              </>
            )}
          </p>
        </div>
        <VersionSelector featuresetName={decoded} currentVersion={detail.version} />
      </div>

      <div className="flex items-start gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          You are viewing the spec as it was at v{detail.version}. Lineage,
          dependents, and recent queries are not shown — they reflect live
          state.{" "}
          <Link
            href={`/catalog/featuresets/${encodeURIComponent(decoded)}`}
            className="underline underline-offset-2 hover:text-amber-100"
          >
            Back to latest
          </Link>
          .
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Schema at v{detail.version}</CardTitle>
        </CardHeader>
        <CardContent>
          {features.length === 0 ? (
            <p className="text-sm italic text-muted-foreground">
              No features defined at this version.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((f) => (
                  <TableRow key={f.name}>
                    <TableCell className="font-mono">{f.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{f.dtype}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {extractors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Extractors at v{detail.version}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {extractors.map((e) => (
                <li key={e.name} className="font-mono">
                  {e.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
