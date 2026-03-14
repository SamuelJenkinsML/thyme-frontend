import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const base = process.env.QUERY_SERVER_URL ?? "http://localhost:8081";
  const search = req.nextUrl.searchParams.toString();
  const res = await fetch(`${base}/features?${search}`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
