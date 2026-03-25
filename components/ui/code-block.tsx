interface CodeBlockProps {
  code: string;
  className?: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  const lines = code.split("\n");

  return (
    <pre className={`overflow-x-auto rounded-md bg-muted p-4 text-xs font-mono whitespace-pre ${className ?? ""}`}>
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="w-8 shrink-0 select-none text-right pr-3 text-muted-foreground/50">
            {i + 1}
          </span>
          <span>{line}</span>
        </div>
      ))}
    </pre>
  );
}
