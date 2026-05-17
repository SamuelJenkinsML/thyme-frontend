import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useDeprecateFeatureset } from "@/lib/hooks/use-deprecate-featureset";

const originalFetch = globalThis.fetch;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function wrapper(client: QueryClient) {
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("useDeprecateFeatureset", () => {
  it("POSTs to the proxy with reason and replacement", async () => {
    const successBody = {
      name: "users",
      deprecated_at: "2026-05-18T00:00:00Z",
      deprecation_reason: "replaced",
      replacement: "users_v2",
    };
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse(successBody));
    globalThis.fetch = fetchMock;

    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    const { result } = renderHook(() => useDeprecateFeatureset("users"), {
      wrapper: wrapper(client),
    });

    result.current.mutate({ reason: "replaced", replacement: "users_v2" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/proxy/featuresets/users/deprecate");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(init?.body as string)).toEqual({
      reason: "replaced",
      replacement: "users_v2",
    });
  });

  it("invalidates the featuresets / search / events queries on success", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      jsonResponse({
        name: "users",
        deprecated_at: "2026-05-18T00:00:00Z",
        deprecation_reason: null,
        replacement: null,
      }),
    );
    globalThis.fetch = fetchMock;

    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useDeprecateFeatureset("users"), {
      wrapper: wrapper(client),
    });
    result.current.mutate({ reason: "x" });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const keys = invalidateSpy.mock.calls.map((c) => c[0]?.queryKey);
    expect(keys).toContainEqual(["featuresets"]);
    expect(keys).toContainEqual(["search"]);
    expect(keys).toContainEqual(["events"]);
  });

  it("surfaces a non-200 response as an error", async () => {
    globalThis.fetch = vi.fn<typeof fetch>(async () =>
      jsonResponse({ error: "not found" }, 404),
    );

    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false } },
    });
    const { result } = renderHook(() => useDeprecateFeatureset("missing"), {
      wrapper: wrapper(client),
    });
    result.current.mutate({ reason: "x" });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
