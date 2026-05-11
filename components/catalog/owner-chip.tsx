import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OwnerChipProps {
  owner?: string | null;
}

export function OwnerChip({ owner }: OwnerChipProps) {
  if (!owner) return null;
  return (
    <Badge
      variant="secondary"
      className="border border-thyme-leaf/20 bg-thyme-leaf/10 text-thyme-leaf text-xs"
    >
      <User />
      {owner}
    </Badge>
  );
}
