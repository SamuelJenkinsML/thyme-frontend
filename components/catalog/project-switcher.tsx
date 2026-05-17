"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/lib/hooks/use-projects";

const ALL = "__all__";

interface ProjectSwitcherProps {
  value: string | null;
  onChange: (next: string | null) => void;
}

export function ProjectSwitcher({ value, onChange }: ProjectSwitcherProps) {
  const projects = useProjects();
  const items = projects.data ?? [];

  const placeholder = projects.isLoading
    ? "Loading projects…"
    : projects.error
      ? "Projects unavailable"
      : "All projects";

  return (
    <Select
      value={value ?? ALL}
      onValueChange={(v) => onChange(!v || v === ALL ? null : v)}
      disabled={projects.isLoading || !!projects.error}
    >
      <SelectTrigger className="w-[180px]" size="sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All projects</SelectItem>
        {items.map((p) => (
          <SelectItem key={p.id} value={p.id}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
