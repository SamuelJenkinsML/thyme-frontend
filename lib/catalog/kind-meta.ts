import { Database, FolderOpen, Plug, Sparkles, Tag, User, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CatalogKind } from "./kind-colors";

export interface KindMeta {
  label: string;
  pluralLabel: string;
  icon: LucideIcon;
  href: (name: string) => string;
}

export const KIND_META: Record<CatalogKind, KindMeta> = {
  featureset: {
    label: "Featureset",
    pluralLabel: "Featuresets",
    icon: Sparkles,
    href: (name) => `/catalog/featuresets/${encodeURIComponent(name)}`,
  },
  dataset: {
    label: "Dataset",
    pluralLabel: "Datasets",
    icon: Database,
    href: (name) => `/catalog/datasets/${encodeURIComponent(name)}`,
  },
  pipeline: {
    label: "Pipeline",
    pluralLabel: "Pipelines",
    icon: Workflow,
    href: (name) => `/catalog/pipelines/${encodeURIComponent(name)}`,
  },
  source: {
    label: "Source",
    pluralLabel: "Sources",
    icon: Plug,
    href: (name) => `/catalog/sources/${encodeURIComponent(name)}`,
  },
  tag: {
    label: "Tag",
    pluralLabel: "Tags",
    icon: Tag,
    href: (name) => `/catalog/tags/${encodeURIComponent(name)}`,
  },
  owner: {
    label: "Owner",
    pluralLabel: "Owners",
    icon: User,
    href: (name) => `/catalog/owners/${encodeURIComponent(name)}`,
  },
  project: {
    label: "Project",
    pluralLabel: "Projects",
    icon: FolderOpen,
    href: (name) => `/catalog/projects/${encodeURIComponent(name)}`,
  },
};
