import { proxyDependents } from "@/lib/api/dependents-proxy";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  return proxyDependents("datasets", name);
}
