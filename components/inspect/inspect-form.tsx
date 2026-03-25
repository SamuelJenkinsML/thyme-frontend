"use client";

import { useState } from "react";
import { useFeaturesets } from "@/lib/hooks/use-featuresets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FeatureQuery } from "@/lib/types";

interface InspectFormProps {
  onSubmit: (query: FeatureQuery) => void;
}

export function InspectForm({ onSubmit }: InspectFormProps) {
  const { data: featuresets } = useFeaturesets();
  const [featureset, setFeatureset] = useState("");
  const [entityId, setEntityId] = useState("");
  const [entityType, setEntityType] = useState("");
  const [timestamp, setTimestamp] = useState("");

  const mode = timestamp ? "offline" : "online";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!entityId.trim()) return;
    onSubmit({
      entity_id: entityId.trim(),
      entity_type: entityType.trim() || undefined,
      featureset: featureset || undefined,
      timestamp: timestamp || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Featureset</label>
          <Select value={featureset} onValueChange={(v) => setFeatureset(v ?? "")}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Select featureset" />
            </SelectTrigger>
            <SelectContent>
              {(featuresets ?? []).map((fs) => (
                <SelectItem key={fs.id} value={fs.name}>
                  {fs.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Entity ID</label>
          <Input
            placeholder="e.g. user_123"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            className="w-52"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Entity Type</label>
          <Input
            placeholder="e.g. user"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="w-40"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Timestamp (optional)</label>
          <Input
            type="datetime-local"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            className="w-52"
          />
        </div>

        <div className="flex items-end gap-2">
          <Button type="submit" disabled={!entityId.trim()}>
            Fetch Features
          </Button>
          <Badge variant={mode === "online" ? "default" : "secondary"}>
            {mode}
          </Badge>
        </div>
      </div>
    </form>
  );
}
