import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { authHeaders } from "@/lib/api/auth";

function definitionBase(): string {
  return process.env.DEFINITION_SERVICE_URL ?? "http://localhost:8080";
}

async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function proxyFeaturesetVersions(name: string) {
  const unauth = await requireSession();
  if (unauth) return unauth;

  const res = await fetch(
    `${definitionBase()}/api/v1/featuresets/${encodeURIComponent(name)}/versions`,
    { cache: "no-store", headers: { ...authHeaders() } },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function proxyFeaturesetVersion(name: string, version: string) {
  const unauth = await requireSession();
  if (unauth) return unauth;

  const res = await fetch(
    `${definitionBase()}/api/v1/featuresets/${encodeURIComponent(name)}/versions/${encodeURIComponent(version)}`,
    { cache: "no-store", headers: { ...authHeaders() } },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function proxyFeaturesetDiff(name: string, search: string) {
  const unauth = await requireSession();
  if (unauth) return unauth;

  const res = await fetch(
    `${definitionBase()}/api/v1/featuresets/${encodeURIComponent(name)}/diff${search}`,
    { cache: "no-store", headers: { ...authHeaders() } },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
