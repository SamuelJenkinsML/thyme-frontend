"use client";

import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/lib/hooks/use-events";

const severityColors: Record<string, string> = {
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  warn: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface ActivitySectionProps {
  featuresetName: string;
}

export function ActivitySection({ featuresetName }: ActivitySectionProps) {
  const { data: rawEvents, isLoading, error } = useEvents(
    { limit: 20, subject: featuresetName },
    15_000,
  );
  // Belt-and-suspenders: the backend events endpoint currently ignores the
  // `subject` filter, so guard scoping on the client until that's fixed.
  const events = rawEvents?.filter((e) => e.subject === featuresetName);

  return (
    <section id="activity" className="scroll-mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <EmptyState
              icon={Activity}
              title="Couldn't load activity"
              description={(error as Error).message}
            />
          ) : !events || events.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No recent activity"
              description="Commit changes or interact with this featureset to see events here."
            />
          ) : (
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
    </section>
  );
}
