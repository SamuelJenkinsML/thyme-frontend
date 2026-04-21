import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authHeaders } from "@/lib/api/auth";

function upstream(path: string[] | undefined, search: string): string {
  const base = process.env.QUERY_SERVER_URL ?? "http://localhost:8081";
  const tail = path && path.length > 0 ? `/${path.join("/")}` : "";
  return `${base}/query-runs${tail}${search}`;
}

async function ensureAuthed() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const unauthorized = await ensureAuthed();
  if (unauthorized) return unauthorized;
  const { path } = await params;
  const url = upstream(path, req.nextUrl.search);
  const res = await fetch(url, { cache: "no-store", headers: { ...authHeaders() } });
  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const unauthorized = await ensureAuthed();
  if (unauthorized) return unauthorized;
  const { path } = await params;
  const url = upstream(path, req.nextUrl.search);
  const body = await req.text();
  const res = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      ...authHeaders(),
      "content-type": req.headers.get("content-type") ?? "application/json",
    },
    body: body || undefined,
  });
  const respBody = await res.text();
  return new NextResponse(respBody, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "application/json" },
  });
}
