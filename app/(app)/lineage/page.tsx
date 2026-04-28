import { BlastRadiusGraph } from "@/components/lineage/blast-radius-graph";
import { DocsLink } from "@/components/shared/docs-link";

export default function LineagePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Lineage</h1>
          <p className="text-sm text-muted-foreground">
            Trace upstream sources and downstream impact across the platform.
            Click any node to highlight its blast radius.
          </p>
        </div>
        <DocsLink href="/docs/concepts/lineage" className="shrink-0 text-xs">
          About lineage
        </DocsLink>
      </div>
      <BlastRadiusGraph />
    </div>
  );
}
