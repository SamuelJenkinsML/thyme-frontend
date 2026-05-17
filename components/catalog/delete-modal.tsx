"use client";

import { useState } from "react";
import { AlertOctagon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { DeprecateModal } from "@/components/catalog/deprecate-modal";
import { useDependents } from "@/lib/hooks/use-dependents";
import { useDeprecateFeatureset } from "@/lib/hooks/use-deprecate-featureset";
import type { DependentRecord } from "@/lib/types";

interface DeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featuresetName: string;
  onDeprecated?: () => void;
}

function groupByKind(dependents: DependentRecord[]): Record<string, DependentRecord[]> {
  const groups: Record<string, DependentRecord[]> = {};
  for (const dep of dependents) {
    (groups[dep.kind] ??= []).push(dep);
  }
  return groups;
}

export function DeleteModal({
  open,
  onOpenChange,
  featuresetName,
  onDeprecated,
}: DeleteModalProps) {
  const [showDeprecate, setShowDeprecate] = useState(false);
  const { data, isLoading, error } = useDependents(
    "featuresets",
    open ? featuresetName : null,
  );
  // No-dependents quick path: deprecate inline with an auto-generated reason.
  const today = new Date().toISOString().slice(0, 10);
  const quickReason = `Removed from catalog on ${today}`;
  const mutation = useDeprecateFeatureset(featuresetName);

  const dependents = data?.dependents ?? [];
  const hasDependents = dependents.length > 0;

  function openDeprecateModal() {
    onOpenChange(false);
    setShowDeprecate(true);
  }

  function handleQuickDeprecate() {
    mutation.mutate(
      { reason: quickReason },
      {
        onSuccess: () => {
          onDeprecated?.();
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2">
                <AlertOctagon className="size-4 text-destructive" aria-hidden />
                Delete featureset
              </DialogTitle>
              <DialogDescription>
                <span className="font-mono">{featuresetName}</span> &mdash;
                review consumers before retiring this entity.
              </DialogDescription>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-64" />
              </div>
            ) : error ? (
              <p className="text-sm text-destructive">
                Failed to check consumers: {error.message}
              </p>
            ) : hasDependents ? (
              <BlockedView
                dependents={dependents}
                onMarkDeprecated={openDeprecateModal}
                onCancel={() => onOpenChange(false)}
              />
            ) : (
              <NoDependentsView
                pending={mutation.isPending}
                onDeprecate={handleQuickDeprecate}
                onOpenAdvanced={openDeprecateModal}
                onCancel={() => onOpenChange(false)}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DeprecateModal
        open={showDeprecate}
        onOpenChange={setShowDeprecate}
        featuresetName={featuresetName}
        defaultReason={quickReason}
        onDeprecated={onDeprecated}
      />
    </>
  );
}

interface BlockedViewProps {
  dependents: DependentRecord[];
  onMarkDeprecated: () => void;
  onCancel: () => void;
}

function BlockedView({
  dependents,
  onMarkDeprecated,
  onCancel,
}: BlockedViewProps) {
  const groups = groupByKind(dependents);
  const kinds = Object.keys(groups).sort();

  return (
    <div className="space-y-4">
      <div
        role="alert"
        className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
      >
        <AlertOctagon className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>
          This featureset is used by {dependents.length} downstream{" "}
          {dependents.length === 1 ? "entity" : "entities"}. Delete is blocked
          to avoid breaking consumers. <strong>Mark it deprecated</strong> so
          consumers see the warning and migrate.
        </p>
      </div>

      <div className="space-y-3 rounded-md border border-border/60 p-3 text-sm">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Consumers
        </p>
        {kinds.map((kind) => (
          <div key={kind}>
            <p className="text-xs text-muted-foreground">
              {kind} ({groups[kind].length})
            </p>
            <ul className="mt-1 space-y-0.5">
              {groups[kind].map((dep) => (
                <li
                  key={`${dep.kind}/${dep.name}/${dep.edge_type}`}
                  className="font-mono text-xs"
                >
                  {dep.name}{" "}
                  <span className="text-[10px] text-muted-foreground">
                    [{dep.edge_type}]
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onMarkDeprecated}>
          Mark deprecated instead
        </Button>
      </div>
    </div>
  );
}

interface NoDependentsViewProps {
  pending: boolean;
  onDeprecate: () => void;
  onOpenAdvanced: () => void;
  onCancel: () => void;
}

function NoDependentsView({
  pending,
  onDeprecate,
  onOpenAdvanced,
  onCancel,
}: NoDependentsViewProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        No downstream consumers. The recommended path is{" "}
        <strong>Mark deprecated</strong> &mdash; consumers see the warning
        even if they revisit later, and the entity stays queryable. Hard
        delete is reserved for admins (RBAC, post Phase E).
      </p>

      <div className="flex flex-col gap-2 rounded-md border border-border/60 p-3 text-sm">
        <Button type="button" onClick={onDeprecate} disabled={pending}>
          <Trash2 className="size-3.5" />
          {pending ? "Marking deprecated…" : "Mark deprecated"}
        </Button>
        <button
          type="button"
          onClick={onOpenAdvanced}
          className="text-left text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Customise reason / replacement first…
        </button>
        <Button
          type="button"
          variant="destructive"
          disabled
          title="Hard delete requires admin role (RBAC) — not yet shipped."
          aria-disabled
        >
          Permanently delete
        </Button>
        <p className="text-[11px] text-muted-foreground">
          Hard delete requires admin role (RBAC). Use deprecation for now.
        </p>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
