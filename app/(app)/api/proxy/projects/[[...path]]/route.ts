import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authHeaders } from "@/lib/api/auth";

function upstream(path: string[] | undefined, search: string): string {
  const base = process.env.DEFINITION_SERVICE_URL ?? "http://localhost:8080";
  const tail = path && path.length > 0 ? `/${path.join("/")}` : "";
  return `${base}/api/v1/projects${tail}${search}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { path } = await params;
  const url = upstream(path, req.nextUrl.search);
  const res = await fetch(url, { cache: "no-store", headers: { ...authHeaders() } });
  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}
