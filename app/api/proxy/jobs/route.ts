import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.DEFINITION_SERVICE_URL ?? "http://localhost:8080";
  const res = await fetch(`${base}/api/v1/jobs`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
