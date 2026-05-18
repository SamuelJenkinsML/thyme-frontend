"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditMetadataModal } from "@/components/catalog/edit-metadata-modal";
import type { MetadataKind } from "@/lib/api/definition";
import type { EntityMetadata } from "@/lib/types";

interface EditMetadataButtonProps {
  kind: MetadataKind;
  name: string;
  initial?: EntityMetadata;
}

// Client island. Sits next to other header actions; opens the edit modal.
export function EditMetadataButton({ kind, name, initial }: EditMetadataButtonProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Pencil className="size-3.5" />
        Edit metadata
      </Button>
      <EditMetadataModal
        open={open}
        onOpenChange={setOpen}
        kind={kind}
        name={name}
        initial={initial}
      />
    </>
  );
}
