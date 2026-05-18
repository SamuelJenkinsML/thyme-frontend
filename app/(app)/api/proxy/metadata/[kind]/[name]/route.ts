import { proxyUpdateMetadata } from "@/lib/api/metadata-proxy";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ kind: string; name: string }> },
) {
  const { kind, name } = await params;
  const body = await req.json().catch(() => ({}));
  return proxyUpdateMetadata(kind, name, body);
}
