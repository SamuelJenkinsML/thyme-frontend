"use client";

import { useEvents } from "@/lib/hooks/use-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";

const severityColors: Record<string, string> = {
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  warn: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface DatasetEventsSectionProps {
  datasetName: string;
}

export function DatasetEventsSection({
  datasetName,
}: DatasetEventsSectionProps) {
  const { data: events, isLoading } = useEvents(
    { limit: 20, subject: datasetName },
    15_000,
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        {!isLoading && (!events || events.length === 0) && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No recent events for this dataset.
          </p>
        )}
        {events && events.length > 0 && (
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-md border border-border/50 px-3 py-2 text-sm"
              >
                <Badge
                  className={`shrink-0 text-[10px] ${severityColors[event.severity] ?? ""}`}
                >
                  {event.severity}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground truncate">{event.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {event.event_type} &middot;{" "}
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
