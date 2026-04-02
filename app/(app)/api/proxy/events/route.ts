import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authHeaders } from "@/lib/api/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = process.env.DEFINITION_SERVICE_URL ?? "http://localhost:8080";
  const search = req.nextUrl.searchParams.toString();
  const res = await fetch(`${base}/api/v1/events?${search}`, {
    cache: "no-store",
    headers: { ...authHeaders() },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
