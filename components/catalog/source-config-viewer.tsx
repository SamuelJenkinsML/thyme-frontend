"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Settings } from "lucide-react";

export const SENSITIVE_KEYS = new Set([
  "password",
  "credentials_json",
  "sasl_password",
  "secret",
  "api_key",
  "token",
]);

export function maskConfig(
  config: Record<string, unknown>,
  reveal: boolean,
): Record<string, unknown> {
  if (reveal) return config;
  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(config)) {
    if (SENSITIVE_KEYS.has(key) && typeof value === "string") {
      masked[key] = "\u2022\u2022\u2022\u2022\u2022\u2022";
    } else {
      masked[key] = value;
    }
  }
  return masked;
}

interface SourceConfigViewerProps {
  config: Record<string, unknown>;
}

export function SourceConfigViewer({ config }: SourceConfigViewerProps) {
  const [reveal, setReveal] = useState(false);
  const hasSensitive = Object.keys(config).some((k) => SENSITIVE_KEYS.has(k));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Settings className="h-4 w-4 text-zinc-400" />
            Connector Configuration
          </CardTitle>
          {hasSensitive && (
            <button
              onClick={() => setReveal((v) => !v)}
              className="flex items-center gap-1.5 rounded-md border border-border/50 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {reveal ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
              {reveal ? "Hide" : "Reveal"} secrets
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs font-mono whitespace-pre">
          {JSON.stringify(maskConfig(config, reveal), null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
