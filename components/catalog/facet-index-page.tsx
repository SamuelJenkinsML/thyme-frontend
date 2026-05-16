import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { KindIcon } from "@/components/catalog/kind-icon";
import { KIND_COLORS, type CatalogKind } from "@/lib/catalog/kind-colors";
import { KIND_META } from "@/lib/catalog/kind-meta";
import type { FacetCount } from "@/lib/types";

interface FacetIndexPageProps {
  kind: Extract<CatalogKind, "tag" | "owner">;
  items: FacetCount[];
}

export function FacetIndexPage({ kind, items }: FacetIndexPageProps) {
  const meta = KIND_META[kind];
  const colors = KIND_COLORS[kind];

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No {meta.pluralLabel.toLowerCase()} registered yet. Add{" "}
        {kind === "tag" ? "tags" : "owners"} via{" "}
        <code className="rounded bg-muted px-1 py-0.5">{`@${kind === "tag" ? "featureset(tags=[...])" : "featureset(owner=\"…\")"}`}</code>{" "}
        in your SDK definitions.
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <Link key={item.name} href={meta.href(item.name)}>
          <Card
            className={`h-full transition-all hover:bg-accent/20 cursor-pointer border-l-2 ${colors.border} ${colors.hoverGlow}`}
          >
            <CardContent className="flex items-center justify-between gap-3 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <KindIcon kind={kind} />
                <span className="truncate font-medium">{item.name}</span>
              </div>
              <span className="shrink-0 text-sm text-muted-foreground">
                {item.count}
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
