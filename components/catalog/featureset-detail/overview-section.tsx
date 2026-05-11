import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeaturesetRecord } from "@/lib/types";

interface OverviewSectionProps {
  fs: FeaturesetRecord;
}

export function OverviewSection({ fs }: OverviewSectionProps) {
  const description = fs.metadata?.description;
  const project = fs.metadata?.project;
  const featureCount = fs.spec.features?.length ?? 0;
  const extractorCount = fs.spec.extractors?.length ?? 0;

  return (
    <section id="overview" className="scroll-mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {description ? (
            <p className="whitespace-pre-wrap text-sm">{description}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              No description provided.
            </p>
          )}

          {project && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Project:</span>
              <Badge variant="secondary">{project}</Badge>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-border/40 pt-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Features
              </p>
              <p className="text-2xl font-semibold">{featureCount}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Extractors
              </p>
              <p className="text-2xl font-semibold">{extractorCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
