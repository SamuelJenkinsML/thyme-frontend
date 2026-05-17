"use client";

import { useState } from "react";
import { ArchiveX, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteModal } from "@/components/catalog/delete-modal";
import { DeprecateModal } from "@/components/catalog/deprecate-modal";

interface HeaderActionsProps {
  featuresetName: string;
  /** When true, the "Mark deprecated" CTA is hidden (already deprecated). */
  isDeprecated: boolean;
}

/**
 * Client wrapper for destructive actions on the featureset detail header.
 * Lives in its own file so `header.tsx` can stay a server component.
 */
export function HeaderActions({
  featuresetName,
  isDeprecated,
}: HeaderActionsProps) {
  const [deprecateOpen, setDeprecateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isDeprecated) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDeprecateOpen(true)}
        >
          <ArchiveX className="size-3.5" />
          Mark deprecated
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </div>
      <DeprecateModal
        open={deprecateOpen}
        onOpenChange={setDeprecateOpen}
        featuresetName={featuresetName}
      />
      <DeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        featuresetName={featuresetName}
      />
    </>
  );
}
