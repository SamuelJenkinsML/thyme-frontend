import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KindIcon } from "@/components/catalog/kind-icon";
import { OwnerChip } from "@/components/catalog/owner-chip";
import { TagChipList } from "@/components/catalog/tag-chip-list";
import { KIND_META } from "@/lib/catalog/kind-meta";
import type { CatalogKind } from "@/lib/catalog/kind-colors";
import type { SearchResponse } from "@/lib/types";

interface FacetDetailTableProps {
  data: SearchResponse;
}

interface Row {
  kind: CatalogKind;
  name: string;
  href: string;
  owner?: string | null;
  tags?: Record<string, string>;
  description?: string | null;
}

function rowsFromSearch(data: SearchResponse): Row[] {
  const rows: Row[] = [];

  for (const fs of data.featuresets) {
    rows.push({
      kind: "featureset",
      name: fs.name,
      href: KIND_META.featureset.href(fs.name),
      owner: fs.metadata?.owner,
      tags: fs.metadata?.tags,
      description: fs.metadata?.description,
    });
  }
  for (const ds of data.datasets) {
    rows.push({
      kind: "dataset",
      name: ds.name,
      href: KIND_META.dataset.href(ds.name),
      owner: ds.metadata?.owner,
      tags: ds.metadata?.tags,
      description: ds.metadata?.description,
    });
  }
  for (const src of data.sources) {
    rows.push({
      kind: "source",
      name: src.dataset,
      href: KIND_META.source.href(src.id),
      owner: src.metadata?.owner,
      tags: src.metadata?.tags,
      description: src.metadata?.description,
    });
  }
  for (const pipe of data.pipelines) {
    rows.push({
      kind: "pipeline",
      name: pipe.name,
      href: KIND_META.pipeline.href(pipe.name),
    });
  }

  rows.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
    return a.name.localeCompare(b.name);
  });

  return rows;
}

export function FacetDetailTable({ data }: FacetDetailTableProps) {
  const rows = rowsFromSearch(data);

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nothing here yet. The tag or owner may not be applied to any registered
        entities.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[140px]">Kind</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="w-[200px]">Owner</TableHead>
          <TableHead>Tags</TableHead>
          <TableHead>Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={`${row.kind}:${row.name}`}>
            <TableCell>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <KindIcon kind={row.kind} />
                {KIND_META[row.kind].label}
              </span>
            </TableCell>
            <TableCell>
              <Link
                href={row.href}
                className="font-mono text-sm hover:text-foreground hover:underline"
              >
                {row.name}
              </Link>
            </TableCell>
            <TableCell>
              {row.owner ? (
                <OwnerChip owner={row.owner} />
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                <TagChipList tags={row.tags} max={3} />
                {!row.tags || Object.keys(row.tags).length === 0 ? (
                  <span className="text-xs text-muted-foreground">—</span>
                ) : null}
              </div>
            </TableCell>
            <TableCell>
              {row.description ? (
                <span className="line-clamp-2 text-sm text-muted-foreground">
                  {row.description}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
