import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SchemaDiff } from "@/components/catalog/versions/schema-diff";
import { fetchFeaturesetDiff } from "@/lib/api/definition";

interface Props {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}

function parseVersion(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

export default async function FeaturesetDiffPage({ params, searchParams }: Props) {
  const [{ name }, sp] = await Promise.all([params, searchParams]);
  const from = parseVersion(sp.from);
  const to = parseVersion(sp.to);
  const decoded = decodeURIComponent(name);

  if (from == null || to == null || from === to) {
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
            { label: "Diff" },
          ]}
        />
        <h1 className="text-2xl font-bold tracking-tight">Schema diff</h1>
        <p className="text-sm text-destructive">
          Provide distinct <code>from</code> and <code>to</code> query
          parameters, e.g. <code>?from=1&amp;to=2</code>.
        </p>
        <Link
          href={`/catalog/featuresets/${encodeURIComponent(decoded)}#versions`}
          className="text-sm text-thyme-leaf underline-offset-2 hover:underline"
        >
          ← Back to versions
        </Link>
      </div>
    );
  }

  let diff;
  try {
    diff = await fetchFeaturesetDiff(decoded, from, to);
  } catch {
    notFound();
  }

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
          { label: `v${from} → v${to}` },
        ]}
      />

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-thyme-leaf">
          Schema diff
        </p>
        <h1 className="text-2xl font-bold tracking-tight">
          {decoded}: v{from} → v{to}
        </h1>
        <Link
          href={`/catalog/featuresets/${encodeURIComponent(decoded)}#versions`}
          className="inline-block text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          ← Back to versions
        </Link>
      </div>

      <SchemaDiff diff={diff} />
    </div>
  );
}
