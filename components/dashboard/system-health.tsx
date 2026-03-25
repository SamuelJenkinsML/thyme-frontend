"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ServiceStatus {
  name: string;
  url: string;
  healthy: boolean | null;
}

export function SystemHealth() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: "definition-service", url: "/api/proxy/featuresets", healthy: null },
    { name: "query-server", url: "/api/proxy/features", healthy: null },
  ]);

  useEffect(() => {
    async function checkHealth() {
      const results = await Promise.all(
        services.map(async (svc) => {
          try {
            const res = await fetch(svc.url, { method: "HEAD" });
            return { ...svc, healthy: res.ok || res.status === 405 };
          } catch {
            return { ...svc, healthy: false };
          }
        })
      );
      setServices(results);
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">System Health</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {services.map((svc) => (
          <div key={svc.name} className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                svc.healthy === null
                  ? "bg-muted-foreground animate-pulse"
                  : svc.healthy
                    ? "bg-green-500"
                    : "bg-red-500"
              }`}
            />
            <span className="text-sm font-mono">{svc.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {svc.healthy === null ? "checking..." : svc.healthy ? "healthy" : "unreachable"}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
