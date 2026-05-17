import { proxyDeprecateFeatureset } from "@/lib/api/featureset-versions-proxy";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const body = await req.json().catch(() => ({}));
  return proxyDeprecateFeatureset(name, body);
}
