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

export async function proxyUpdateMetadata(
  kind: string,
  name: string,
  body: unknown,
) {
  const unauth = await requireSession();
  if (unauth) return unauth;

  const res = await fetch(
    `${definitionBase()}/api/v1/metadata/${encodeURIComponent(kind)}/${encodeURIComponent(name)}`,
    {
      method: "PATCH",
      cache: "no-store",
      headers: {
        ...authHeaders(),
        "content-type": "application/json",
      },
      body: JSON.stringify(body ?? {}),
    },
  );
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
