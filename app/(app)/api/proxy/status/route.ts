import { NextResponse } from "next/server";
import { authHeaders } from "@/lib/api/auth";

export async function GET() {
  const base = process.env.DEFINITION_SERVICE_URL ?? "http://localhost:8080";
  const res = await fetch(`${base}/api/v1/status`, {
    cache: "no-store",
    headers: { ...authHeaders() },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
