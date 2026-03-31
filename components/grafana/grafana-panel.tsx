import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GrafanaPanelProps {
  dashboardUid: string;
  panelId: number;
  title: string;
  height?: number;
}

export function GrafanaPanel({
  dashboardUid,
  panelId,
  title,
  height = 300,
}: GrafanaPanelProps) {
  const grafanaUrl = process.env.NEXT_PUBLIC_GRAFANA_URL;
  const src = `${grafanaUrl}/d-solo/${dashboardUid}/?orgId=1&panelId=${panelId}&theme=dark`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <iframe
          src={src}
          width="100%"
          height={height}
          frameBorder="0"
          loading="lazy"
          allow="fullscreen"
          className="rounded-md"
        />
      </CardContent>
    </Card>
  );
}
