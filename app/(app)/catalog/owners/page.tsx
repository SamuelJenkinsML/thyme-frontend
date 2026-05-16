import { fetchOwners } from "@/lib/api/definition";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FacetIndexPage } from "@/components/catalog/facet-index-page";

export default async function OwnersIndexPage() {
  const owners = await fetchOwners();

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[{ label: "Catalog", href: "/catalog" }, { label: "Owners" }]}
      />
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Owners</h1>
        <p className="text-sm text-muted-foreground">
          Browse entities by owner. {owners.length}{" "}
          {owners.length === 1 ? "owner" : "owners"} listed.
        </p>
      </header>
      <FacetIndexPage kind="owner" items={owners} />
    </div>
  );
}
