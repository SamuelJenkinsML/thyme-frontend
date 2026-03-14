import { notFound } from "next/navigation";
import { fetchSources, fetchJobs } from "@/lib/api/definition";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
            <span className="font-mono">{src.cursor_field || "—"}</span>
            <span className="text-muted-foreground">Poll interval</span>
            <span className="font-mono">{src.poll_interval || "—"}</span>
            <span className="text-muted-foreground">Last cursor</span>
            <span className="font-mono text-xs">{src.cursor_value || "—"}</span>
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
            {consumingJobs.map((j) => (
              <p key={j.id} className="font-mono text-sm">
                {j.name}
              </p>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
