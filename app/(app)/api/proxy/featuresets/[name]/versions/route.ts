import { proxyFeaturesetVersions } from "@/lib/api/featureset-versions-proxy";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  return proxyFeaturesetVersions(name);
}
