import { fetchSearch } from "@/lib/api/definition";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FacetDetailTable } from "@/components/catalog/facet-detail-table";
import { KindIcon } from "@/components/catalog/kind-icon";

interface Props {
  params: Promise<{ owner: string }>;
}

function totalCount(data: Awaited<ReturnType<typeof fetchSearch>>): number {
  return (
    data.featuresets.length +
    data.datasets.length +
    data.pipelines.length +
    data.sources.length
  );
}

export default async function OwnerDetailPage({ params }: Props) {
  const { owner } = await params;
  const decoded = decodeURIComponent(owner);
  const data = await fetchSearch({ owners: [decoded], limit: 100 });
  const count = totalCount(data);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Catalog", href: "/catalog" },
          { label: "Owners", href: "/catalog/owners" },
          { label: decoded },
        ]}
      />
      <header className="flex items-center gap-3">
        <KindIcon kind="owner" className="size-8" iconClassName="size-4" />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{decoded}</h1>
          <p className="text-sm text-muted-foreground">
            {count} {count === 1 ? "entity" : "entities"} owned by{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              {decoded}
            </code>
            .
          </p>
        </div>
      </header>
      <FacetDetailTable data={data} />
    </div>
  );
}
