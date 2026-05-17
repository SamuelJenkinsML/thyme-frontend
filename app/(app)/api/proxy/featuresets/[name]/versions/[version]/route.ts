import { proxyFeaturesetVersion } from "@/lib/api/featureset-versions-proxy";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string; version: string }> },
) {
  const { name, version } = await params;
  return proxyFeaturesetVersion(name, version);
}
