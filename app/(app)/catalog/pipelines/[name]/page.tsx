import { notFound } from "next/navigation";
import { fetchJobs } from "@/lib/api/definition";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { PipelineFlow } from "@/components/catalog/pipeline-flow";
import { ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function PipelineDetailPage({ params }: Props) {
  const { name } = await params;
  const jobs = await fetchJobs();
  const decodedName = decodeURIComponent(name);
  const job = jobs.find(
    (j) => j.name === decodedName || j.name === `${decodedName}_job`
  );

  if (!job) notFound();

  const spec = job.spec;
  const operators = spec.pipeline_spec?.operators ?? [];

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Catalog", href: "/catalog" },
          { label: "Pipelines", href: "/catalog" },
          { label: decodedName },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">{job.name}</h1>
        <p className="text-sm text-muted-foreground">{job.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Topic Routing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-muted-foreground">{spec.input_topic}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span>{spec.output_topic}</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">{job.partition_count} partitions</Badge>
            {spec.pipeline_spec?.disorder && (
              <Badge variant="outline">disorder {spec.pipeline_spec.disorder}</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            replaylog: {spec.replaylog_topic}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operators ({operators.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {operators.length > 0 ? (
            <PipelineFlow
              inputTopic={spec.input_topic}
              outputTopic={spec.output_topic}
              operators={operators}
            />
          ) : (
            <p className="text-sm text-muted-foreground">No operators defined.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
