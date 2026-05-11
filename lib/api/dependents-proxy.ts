import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authHeaders } from "@/lib/api/auth";
import type { DependentsKind } from "@/lib/types";

export async function proxyDependents(kind: DependentsKind, name: string) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const base = process.env.DEFINITION_SERVICE_URL ?? "http://localhost:8080";
  const res = await fetch(
    `${base}/api/v1/${kind}/${encodeURIComponent(name)}/dependents`,
    { cache: "no-store", headers: { ...authHeaders() } },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
