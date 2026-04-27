import { BlastRadiusGraph } from "@/components/lineage/blast-radius-graph";

export default function LineagePage() {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Lineage</h1>
        <p className="text-sm text-muted-foreground">
          Trace upstream sources and downstream impact across the platform.
          Click any node to highlight its blast radius.
        </p>
      </div>
      <BlastRadiusGraph />
    </div>
  );
}
