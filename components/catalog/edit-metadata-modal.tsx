"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateMetadata } from "@/lib/hooks/use-update-metadata";
import type { MetadataKind, MetadataPatch } from "@/lib/api/definition";
import type { EntityMetadata } from "@/lib/types";

interface EditMetadataModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kind: MetadataKind;
  name: string;
  initial?: EntityMetadata;
}

function tagsToTokens(tags: Record<string, string> | undefined): string[] {
  if (!tags) return [];
  return Object.entries(tags).map(([k, v]) => (v ? `${k}:${v}` : k));
}

function tokensToTags(tokens: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const raw of tokens) {
    const t = raw.trim();
    if (!t) continue;
    const colon = t.indexOf(":");
    if (colon === -1) {
      out[t] = "";
    } else {
      out[t.slice(0, colon).trim()] = t.slice(colon + 1).trim();
    }
  }
  return out;
}

export function EditMetadataModal({
  open,
  onOpenChange,
  kind,
  name,
  initial,
}: EditMetadataModalProps) {
  const descriptionId = useId();
  const ownerId = useId();
  const tagsId = useId();

  const [description, setDescription] = useState(initial?.description ?? "");
  const [owner, setOwner] = useState(initial?.owner ?? "");
  const [tagTokens, setTagTokens] = useState<string[]>(() => tagsToTokens(initial?.tags));
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Re-seed when the entity changes (modal can be reused across rows).
  useEffect(() => {
    if (!open) return;
    setDescription(initial?.description ?? "");
    setOwner(initial?.owner ?? "");
    setTagTokens(tagsToTokens(initial?.tags));
    setTagInput("");
    setError(null);
  }, [open, initial]);

  const mutation = useUpdateMetadata(kind, name);

  function commitPendingToken() {
    const t = tagInput.trim();
    if (!t) return;
    setTagTokens((prev) => (prev.includes(t) ? prev : [...prev, t]));
    setTagInput("");
  }

  function handleTagKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitPendingToken();
    } else if (e.key === "Backspace" && tagInput === "" && tagTokens.length > 0) {
      e.preventDefault();
      setTagTokens((prev) => prev.slice(0, -1));
    }
  }

  function removeToken(idx: number) {
    setTagTokens((prev) => prev.filter((_, i) => i !== idx));
  }

  function buildPatch(): MetadataPatch {
    const patch: MetadataPatch = {};
    const trimmedDesc = description.trim();
    const trimmedOwner = owner.trim();
    if (trimmedDesc !== (initial?.description?.trim() ?? "")) {
      patch.description = trimmedDesc;
    }
    if (trimmedOwner !== (initial?.owner?.trim() ?? "")) {
      patch.owner = trimmedOwner;
    }
    // Always serialise the pending token so unsubmitted typing is respected.
    const effectiveTokens = tagInput.trim()
      ? [...tagTokens, tagInput.trim()]
      : tagTokens;
    const nextTags = tokensToTags(effectiveTokens);
    const prevTags = initial?.tags ?? {};
    const tagsChanged =
      Object.keys(nextTags).length !== Object.keys(prevTags).length ||
      Object.entries(nextTags).some(([k, v]) => prevTags[k] !== v);
    if (tagsChanged) patch.tags = nextTags;
    return patch;
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const patch = buildPatch();
    if (Object.keys(patch).length === 0) {
      onOpenChange(false);
      return;
    }
    setError(null);
    mutation.mutate(patch, {
      onSuccess: () => onOpenChange(false),
      onError: (err) =>
        setError(err instanceof Error ? err.message : "Failed to update metadata"),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="size-4" aria-hidden />
              Edit metadata
            </DialogTitle>
            <DialogDescription>
              Update description, owner, and tags for{" "}
              <span className="font-mono">{name}</span>. Changes are reflected
              immediately across the catalog.
            </DialogDescription>
          </div>

          <div className="space-y-1.5">
            <label htmlFor={descriptionId} className="text-sm font-medium">
              Description
            </label>
            <textarea
              id={descriptionId}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this entity do?"
              rows={4}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <p className="text-xs text-muted-foreground">
              Supports markdown — headings, lists, code, links, tables.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor={ownerId} className="text-sm font-medium">
              Owner
            </label>
            <Input
              id={ownerId}
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="team@example.com"
              autoComplete="off"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor={tagsId} className="text-sm font-medium">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent p-2 text-sm">
              {tagTokens.map((token, idx) => (
                <span
                  key={`${token}-${idx}`}
                  className="inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs"
                >
                  <span className="font-mono">{token}</span>
                  <button
                    type="button"
                    onClick={() => removeToken(idx)}
                    aria-label={`Remove tag ${token}`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <input
                id={tagsId}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={commitPendingToken}
                placeholder={tagTokens.length === 0 ? "team:ml, env:prod" : ""}
                className="flex-1 min-w-[8ch] bg-transparent outline-none text-sm"
                autoComplete="off"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter or comma to add. <code>key:value</code> for paired tags;
              plain text for bare keys.
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
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
