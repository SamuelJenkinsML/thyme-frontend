import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocsLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function DocsLink({ href, children, className }: DocsLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5" aria-hidden />
    </Link>
  );
}
