"use client";

import { useMemo } from "react";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useEvents } from "@/lib/hooks/use-events";

const severityColors: Record<string, string> = {
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  warn: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  error: "bg-red-500/10 text-red-400 border-red-500/20",
};

// v1: the events table carries `subject = entity name`, not `project_id`, so
// we filter client-side over a recent slice. Phase F is expected to add
// `project_id` to the events schema and a server-side filter.
const RECENT_LIMIT = 100;
const DISPLAY_LIMIT = 30;

interface ProjectActivityFeedProps {
  memberNames: string[];
}

export function ProjectActivityFeed({ memberNames }: ProjectActivityFeedProps) {
  const { data: events, isLoading } = useEvents(
    { limit: RECENT_LIMIT },
    15_000,
  );

  const memberSet = useMemo(() => new Set(memberNames), [memberNames]);
  const scoped = useMemo(() => {
    if (!events) return [];
    return events.filter((e) => memberSet.has(e.subject)).slice(0, DISPLAY_LIMIT);
  }, [events, memberSet]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        {!isLoading && scoped.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No recent activity for this project&apos;s members.
          </p>
        )}
        {scoped.length > 0 && (
          <div className="space-y-2">
            {scoped.map((event) => (
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
                    {event.event_type} &middot; {event.subject} &middot;{" "}
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Project-scoped server-side filtering coming with Phase F.
        </p>
      </CardContent>
    </Card>
  );
}
