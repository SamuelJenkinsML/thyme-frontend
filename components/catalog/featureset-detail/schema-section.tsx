import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FeatureDef } from "@/lib/types";

interface SchemaSectionProps {
  features: FeatureDef[];
}

export function SchemaSection({ features }: SchemaSectionProps) {
  return (
    <section id="schema" className="scroll-mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Schema</CardTitle>
        </CardHeader>
        <CardContent>
          {features.length === 0 ? (
            <p className="text-sm italic text-muted-foreground">
              No features defined.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((f) => (
                  <TableRow key={f.name}>
                    <TableCell className="font-mono">{f.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{f.dtype}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
