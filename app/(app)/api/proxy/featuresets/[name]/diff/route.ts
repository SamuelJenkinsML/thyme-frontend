import { proxyFeaturesetDiff } from "@/lib/api/featureset-versions-proxy";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const { search } = new URL(req.url);
  return proxyFeaturesetDiff(name, search);
}
