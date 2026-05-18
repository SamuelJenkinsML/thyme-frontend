import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/lib/utils";

interface MarkdownDescriptionProps {
  children: string;
  className?: string;
}

// Renders user-supplied markdown safely. react-markdown 9 strips raw HTML by
// default; layering rehype-sanitize on top gives defence-in-depth against
// future plugin choices. Do NOT add rehype-raw — it would defeat both layers.
export function MarkdownDescription({ children, className }: MarkdownDescriptionProps) {
  return (
    <div className={cn("text-sm space-y-2", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ children, ...props }) => (
            <h1 className="mt-2 mb-1 text-base font-semibold" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="mt-2 mb-1 text-sm font-semibold" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-sm font-medium" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="text-sm leading-6" {...props}>
              {children}
            </p>
          ),
          a: ({ children, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
            >
              {children}
            </a>
          ),
          code: ({ children, ...props }) => (
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs" {...props}>
              {children}
            </code>
          ),
          pre: ({ children, ...props }) => (
            <pre
              className="overflow-x-auto rounded-md bg-muted p-3 text-xs"
              {...props}
            >
              {children}
            </pre>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc space-y-1 pl-5" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal space-y-1 pl-5" {...props}>
              {children}
            </ol>
          ),
          table: ({ children, ...props }) => (
            <table className="w-full border-collapse text-xs" {...props}>
              {children}
            </table>
          ),
          th: ({ children, ...props }) => (
            <th
              className="border border-border/40 px-2 py-1 text-left font-medium"
              {...props}
            >
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-border/40 px-2 py-1" {...props}>
              {children}
            </td>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-2 border-border pl-3 italic text-muted-foreground"
              {...props}
            >
              {children}
            </blockquote>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
