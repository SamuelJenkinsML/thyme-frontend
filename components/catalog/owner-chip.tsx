import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OwnerChipProps {
  owner?: string | null;
}

export function OwnerChip({ owner }: OwnerChipProps) {
  if (!owner) return null;
  return (
    <Badge variant="secondary" className="text-xs">
      <User />
      {owner}
    </Badge>
  );
}
