"use client";

import { useState, useMemo } from "react";
import { useEvents } from "@/lib/hooks/use-events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell } from "lucide-react";

function severityClass(severity: string) {
  switch (severity) {
    case "info":
      return "bg-blue-500/15 text-blue-400 border-transparent";
    case "warn":
      return "bg-amber-500/15 text-amber-400 border-transparent";
    case "error":
      return "bg-red-500/15 text-red-400 border-transparent";
    default:
      return "";
  }
}

function formatEventType(type: string) {
  return type.replace(/_/g, " ");
}

export function EventsFeed() {
  const [severity, setSeverity] = useState("");
  const [eventType, setEventType] = useState("");

  const { data, isLoading } = useEvents(
    {
      limit: 50,
      severity: severity || undefined,
      event_type: eventType || undefined,
    },
    15_000
  );

  const eventTypes = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((e) => e.event_type))].sort();
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Bell className="size-4" />
          Events
        </CardTitle>
        <div className="flex gap-2">
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="rounded-md border border-input bg-transparent px-2 py-1 text-xs outline-none"
          >
            <option value="">All severities</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="rounded-md border border-input bg-transparent px-2 py-1 text-xs outline-none"
          >
            <option value="">All types</option>
            {eventTypes.map((t) => (
              <option key={t} value={t}>
                {formatEventType(t)}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-md" />
            ))}
          </div>
        ) : !data?.length ? (
          <p className="text-sm text-muted-foreground">No events found.</p>
        ) : (
          <div className="space-y-3">
            {data.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-1 rounded-md border border-border/50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-[0.65rem]">
                    {formatEventType(event.event_type)}
                  </Badge>
                  <Badge className={severityClass(event.severity)}>
                    {event.severity}
                  </Badge>
                  <span className="ml-auto text-[0.65rem] text-muted-foreground">
                    {new Date(event.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm">{event.message}</p>
                <p className="text-xs text-muted-foreground">
                  {event.source}
                  {event.subject ? ` / ${event.subject}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
