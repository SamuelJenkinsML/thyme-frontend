import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useUpdateMetadata } from "@/lib/hooks/use-update-metadata";

const originalFetch = globalThis.fetch;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function wrapper(client: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("useUpdateMetadata", () => {
  it("PATCHes the proxy with the patch body", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      jsonResponse({ description: "hi", owner: null, tags: {} }),
    );
    globalThis.fetch = fetchMock;

    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const { result } = renderHook(
      () => useUpdateMetadata("featureset", "users"),
      { wrapper: wrapper(client) },
    );

    result.current.mutate({ description: "hi" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/proxy/metadata/featureset/users");
    expect(init?.method).toBe("PATCH");
    expect(JSON.parse(init?.body as string)).toEqual({ description: "hi" });
  });

  it("optimistically patches the in-cache featureset list", async () => {
    // Slow fetch so we can observe the optimistic state before settle.
    let resolveFetch!: (r: Response) => void;
    const fetchMock = vi.fn<typeof fetch>(
      () =>
        new Promise<Response>((r) => {
          resolveFetch = r;
        }),
    );
    globalThis.fetch = fetchMock;

    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    client.setQueryData(["featuresets"], [
      { id: "1", name: "users", spec: { features: [], extractors: [] }, metadata: { description: "old" } },
      { id: "2", name: "other", spec: { features: [], extractors: [] } },
    ]);

    const { result } = renderHook(
      () => useUpdateMetadata("featureset", "users"),
      { wrapper: wrapper(client) },
    );

    result.current.mutate({ description: "new" });

    // Optimistic patch should land synchronously after mutate.
    await waitFor(() => {
      const data = client.getQueryData<Array<{ name: string; metadata?: { description?: string } }>>(["featuresets"]);
      expect(data?.[0].metadata?.description).toBe("new");
    });
    // Untouched row is untouched.
    const data = client.getQueryData<Array<{ name: string; metadata?: { description?: string } }>>(["featuresets"]);
    expect(data?.[1].metadata?.description).toBeUndefined();

    // Resolve fetch to clean up.
    resolveFetch(jsonResponse({ description: "new" }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("rolls back on error", async () => {
    globalThis.fetch = vi.fn<typeof fetch>(async () =>
      jsonResponse({ error: "boom" }, 500),
    );

    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const original = [
      { id: "1", name: "users", spec: { features: [], extractors: [] }, metadata: { description: "old" } },
    ];
    client.setQueryData(["featuresets"], original);

    const { result } = renderHook(
      () => useUpdateMetadata("featureset", "users"),
      { wrapper: wrapper(client) },
    );

    result.current.mutate({ description: "new" });
    await waitFor(() => expect(result.current.isError).toBe(true));

    const data = client.getQueryData<typeof original>(["featuresets"]);
    expect(data?.[0].metadata?.description).toBe("old");
  });

  it("invalidates all relevant query families on settle", async () => {
    globalThis.fetch = vi.fn<typeof fetch>(async () =>
      jsonResponse({ description: "hi" }),
    );

    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(
      () => useUpdateMetadata("featureset", "users"),
      { wrapper: wrapper(client) },
    );
    result.current.mutate({ description: "hi" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const keys = invalidateSpy.mock.calls.map((c) => c[0]?.queryKey);
    for (const k of ["featuresets", "datasets", "sources", "search", "owners", "tags", "events"]) {
      expect(keys).toContainEqual([k]);
    }
  });
});
