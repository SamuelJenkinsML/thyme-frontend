import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authHeaders } from "@/lib/api/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = process.env.QUERY_SERVER_URL ?? "http://localhost:8081";
  const res = await fetch(`${base}/health`, {
    cache: "no-store",
    headers: { ...authHeaders() },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
