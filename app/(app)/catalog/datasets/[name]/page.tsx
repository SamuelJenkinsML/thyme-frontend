import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchSources, fetchJobs } from "@/lib/api/definition";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function DatasetDetailPage({ params }: Props) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const [sources, jobs] = await Promise.all([fetchSources(), fetchJobs()]);
  const src = sources.find((s) => s.dataset === decodedName);

  if (!src) notFound();

  const topic = `${src.dataset}_topic`;
  const consumingJobs = jobs.filter((j) => j.spec.input_topic === topic);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Catalog", href: "/catalog" },
          { label: "Datasets", href: "/catalog" },
          { label: src.dataset },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold tracking-tight">{src.dataset}</h1>
        <p className="text-sm text-muted-foreground">{src.id}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Source</CardTitle>
            <Badge>{src.connector_type}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <span className="text-muted-foreground">Topic</span>
            <span className="font-mono">{topic}</span>
            <span className="text-muted-foreground">Cursor field</span>
            <span className="font-mono">{src.cursor_field || "\u2014"}</span>
            <span className="text-muted-foreground">Poll interval</span>
            <span className="font-mono">{src.poll_interval || "\u2014"}</span>
            <span className="text-muted-foreground">Last cursor</span>
            <span className="font-mono text-xs">{src.cursor_value || "\u2014"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connector Config</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs font-mono whitespace-pre">
            {JSON.stringify(src.config, null, 2)}
          </pre>
        </CardContent>
      </Card>

      {consumingJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Consuming Jobs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {consumingJobs.map((j) => {
              const pipelineName = j.name.replace(/_job$/, "");
              return (
                <Link
                  key={j.id}
                  href={`/catalog/pipelines/${encodeURIComponent(pipelineName)}`}
                  className="block font-mono text-sm text-foreground hover:text-primary transition-colors"
                >
                  {j.name}
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
