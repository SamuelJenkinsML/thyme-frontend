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
import type { FeaturesetDiff } from "@/lib/types";

interface SchemaDiffProps {
  diff: FeaturesetDiff;
}

function isEmpty(d: FeaturesetDiff): boolean {
  return (
    d.added.length === 0 &&
    d.removed.length === 0 &&
    d.changed.length === 0 &&
    d.extractors_added.length === 0 &&
    d.extractors_removed.length === 0 &&
    d.extractors_changed.length === 0
  );
}

export function SchemaDiff({ diff }: SchemaDiffProps) {
  if (isEmpty(diff)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No differences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            v{diff.from} and v{diff.to} have identical specs.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          {diff.added.length === 0 && diff.removed.length === 0 && diff.changed.length === 0 ? (
            <p className="text-sm italic text-muted-foreground">
              No feature changes between v{diff.from} and v{diff.to}.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Change</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diff.added.map((f) => (
                  <TableRow
                    key={`added-${f.name}`}
                    className="bg-emerald-500/10 hover:bg-emerald-500/15"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/40 text-emerald-300"
                      >
                        added
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{f.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{f.dtype}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {diff.removed.map((f) => (
                  <TableRow
                    key={`removed-${f.name}`}
                    className="bg-red-500/10 hover:bg-red-500/15"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-red-500/40 text-red-300"
                      >
                        removed
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{f.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{f.dtype}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {diff.changed.map((f) => (
                  <TableRow
                    key={`changed-${f.name}`}
                    className="bg-amber-500/10 hover:bg-amber-500/15"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-amber-500/40 text-amber-300"
                      >
                        changed
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{f.name}</TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">
                        <span className="text-red-300">{f.from_dtype}</span>
                        {" → "}
                        <span className="text-emerald-300">{f.to_dtype}</span>
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {(diff.extractors_added.length > 0 ||
        diff.extractors_removed.length > 0 ||
        diff.extractors_changed.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Extractors</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Change</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {diff.extractors_added.map((name) => (
                  <TableRow
                    key={`ext-added-${name}`}
                    className="bg-emerald-500/10 hover:bg-emerald-500/15"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/40 text-emerald-300"
                      >
                        added
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{name}</TableCell>
                  </TableRow>
                ))}
                {diff.extractors_removed.map((name) => (
                  <TableRow
                    key={`ext-removed-${name}`}
                    className="bg-red-500/10 hover:bg-red-500/15"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-red-500/40 text-red-300"
                      >
                        removed
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{name}</TableCell>
                  </TableRow>
                ))}
                {diff.extractors_changed.map((name) => (
                  <TableRow
                    key={`ext-changed-${name}`}
                    className="bg-amber-500/10 hover:bg-amber-500/15"
                  >
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-amber-500/40 text-amber-300"
                      >
                        changed
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">{name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
