import { fetchTags } from "@/lib/api/definition";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FacetIndexPage } from "@/components/catalog/facet-index-page";

export default async function TagsIndexPage() {
  const tags = await fetchTags();

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[{ label: "Catalog", href: "/catalog" }, { label: "Tags" }]}
      />
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
        <p className="text-sm text-muted-foreground">
          Browse entities by tag. {tags.length}{" "}
          {tags.length === 1 ? "tag" : "tags"} in use.
        </p>
      </header>
      <FacetIndexPage kind="tag" items={tags} />
    </div>
  );
}
