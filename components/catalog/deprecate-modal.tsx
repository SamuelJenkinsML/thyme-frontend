"use client";

import { useId, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDeprecateFeatureset } from "@/lib/hooks/use-deprecate-featureset";
import { useFeaturesets } from "@/lib/hooks/use-featuresets";

interface DeprecateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featuresetName: string;
  /** Pre-fill reason and replacement when invoked from the delete-flow. */
  defaultReason?: string;
  onDeprecated?: () => void;
}

export function DeprecateModal({
  open,
  onOpenChange,
  featuresetName,
  defaultReason,
  onDeprecated,
}: DeprecateModalProps) {
  const reasonId = useId();
  const replacementId = useId();
  const datalistId = useId();
  const [reason, setReason] = useState(defaultReason ?? "");
  const [replacement, setReplacement] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { data: allFeaturesets } = useFeaturesets();
  const replacementOptions = useMemo(() => {
    return (allFeaturesets ?? [])
      .map((f) => f.name)
      .filter((n) => n !== featuresetName)
      .sort();
  }, [allFeaturesets, featuresetName]);

  const mutation = useDeprecateFeatureset(featuresetName);
  const trimmedReason = reason.trim();
  const isSubmitDisabled = trimmedReason.length === 0 || mutation.isPending;

  function reset() {
    setReason(defaultReason ?? "");
    setReplacement("");
    setError(null);
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (trimmedReason.length === 0) return;
    setError(null);
    mutation.mutate(
      {
        reason: trimmedReason,
        replacement: replacement.trim() || null,
      },
      {
        onSuccess: () => {
          onDeprecated?.();
          handleOpenChange(false);
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : "Failed to deprecate");
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-yellow-400" aria-hidden />
              Mark featureset deprecated
            </DialogTitle>
            <DialogDescription>
              Deprecating <span className="font-mono">{featuresetName}</span>{" "}
              keeps it readable and queryable but flags it across the catalog
              so consumers can migrate. This action is reversible by editing
              metadata.
            </DialogDescription>
          </div>

          <div className="space-y-1.5">
            <label htmlFor={reasonId} className="text-sm font-medium">
              Reason <span className="text-destructive">*</span>
            </label>
            <textarea
              id={reasonId}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this featureset being retired?"
              required
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor={replacementId} className="text-sm font-medium">
              Replacement{" "}
              <span className="text-xs font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <Input
              id={replacementId}
              value={replacement}
              onChange={(e) => setReplacement(e.target.value)}
              list={datalistId}
              placeholder="users_v2"
              autoComplete="off"
            />
            <datalist id={datalistId}>
              {replacementOptions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            <p className="text-xs text-muted-foreground">
              Name of the featureset that supersedes this one. Shown to
              consumers in the deprecation banner.
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitDisabled}>
              {mutation.isPending ? "Deprecating…" : "Mark deprecated"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
