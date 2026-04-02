"use client";

import { useState } from "react";
import Link from "next/link";
import type { SourceRecord } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, ArrowUpRight } from "lucide-react";

const cdcColors: Record<string, string> = {
  append: "default",
  upsert: "secondary",
  delete: "destructive",
};

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
          <div className="flex gap-1">
            <Badge variant="secondary">{src.connector_type}</Badge>
            {src.cdc && (
              <Badge variant={(cdcColors[src.cdc] ?? "outline") as "default" | "secondary" | "destructive" | "outline"}>
                {src.cdc}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          <span className="text-muted-foreground">Cursor field</span>
          <span className="font-mono">{src.cursor_field || "\u2014"}</span>
          <span className="text-muted-foreground">Poll interval</span>
          <span className="font-mono">{src.poll_interval || "\u2014"}</span>
          <span className="text-muted-foreground">Last cursor</span>
          <span className="font-mono truncate" title={src.cursor_value}>
            {src.cursor_value || "\u2014"}
          </span>
          {src.disorder && (
            <>
              <span className="text-muted-foreground">Disorder</span>
              <span className="font-mono">{src.disorder}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
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
          <Link
            href={`/catalog/sources/${encodeURIComponent(src.id)}`}
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View Details
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
        {configExpanded && (
          <pre className="overflow-x-auto rounded-md bg-muted p-2 text-xs font-mono whitespace-pre">
            {JSON.stringify(src.config, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
