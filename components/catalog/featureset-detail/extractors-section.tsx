import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import type { ExtractorDef } from "@/lib/types";

interface ExtractorsSectionProps {
  extractors: ExtractorDef[];
}

export function ExtractorsSection({ extractors }: ExtractorsSectionProps) {
  if (extractors.length === 0) return null;

  return (
    <section id="extractors" className="scroll-mt-6 space-y-3">
      <h2 className="text-lg font-semibold">Extractors</h2>
      {extractors.map((ext) => (
        <Card key={ext.name}>
          <CardHeader>
            <CardTitle className="text-base">{ext.name}</CardTitle>
            <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <span className="font-mono">{ext.inputs.join(", ")}</span>
              <ArrowRight className="h-3 w-3" />
              <span className="font-mono">{ext.outputs.join(", ")}</span>
            </div>
            {ext.deps.length > 0 && (
              <p className="text-xs text-muted-foreground">
                depends on:{" "}
                {ext.deps.map((d, i) => (
                  <Badge
                    key={i}
                    variant="ghost"
                    className="mx-0.5 h-4 text-[10px]"
                  >
                    {d}
                  </Badge>
                ))}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {ext.pycode?.imports && (
              <details className="group">
                <summary className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground">
                  Imports
                </summary>
                <pre className="mt-2 overflow-x-auto whitespace-pre rounded-md bg-muted p-3 font-mono text-xs">
                  {ext.pycode.imports}
                </pre>
              </details>
            )}
            {ext.pycode?.source_code && (
              <CodeBlock code={ext.pycode.source_code} />
            )}
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
