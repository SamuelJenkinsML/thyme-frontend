"use client";

import { useState } from "react";
import type { SourceRecord } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SourceCardProps {
  source: SourceRecord;
}

export function SourceCard({ source: src }: SourceCardProps) {
  const [configExpanded, setConfigExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{src.dataset}</CardTitle>
          <Badge variant="secondary">{src.connector_type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          <span className="text-muted-foreground">Cursor field</span>
          <span className="font-mono">{src.cursor_field || "—"}</span>
          <span className="text-muted-foreground">Poll interval</span>
          <span className="font-mono">{src.poll_interval || "—"}</span>
          <span className="text-muted-foreground">Last cursor</span>
          <span className="font-mono truncate" title={src.cursor_value}>
            {src.cursor_value || "—"}
          </span>
        </div>

        <div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-0 text-xs text-muted-foreground"
            onClick={() => setConfigExpanded((v) => !v)}
          >
            {configExpanded ? (
              <ChevronDown className="mr-1 h-3 w-3" />
            ) : (
              <ChevronRight className="mr-1 h-3 w-3" />
            )}
            Config
          </Button>
          {configExpanded && (
            <pre className="mt-1 overflow-x-auto rounded-md bg-muted p-2 text-xs font-mono whitespace-pre">
              {JSON.stringify(src.config, null, 2)}
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
