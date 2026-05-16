import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useSearch } from "@/lib/hooks/use-search";
import { useTags } from "@/lib/hooks/use-tags";
import { useOwners } from "@/lib/hooks/use-owners";

const originalFetch = globalThis.fetch;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

// jsdom already provides `window`, which is what definitionBase() needs to
// route through /api/proxy/. No window stub here (unlike the unit tests for
// fetch helpers, which run without a real DOM).

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
  globalThis.fetch = originalFetch;
});

function wrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

const emptySearchResponse = {
  featuresets: [],
  datasets: [],
  pipelines: [],
  sources: [],
  tags: [],
  owners: [],
  projects: [],
};

describe("useSearch", () => {
  it("coalesces rapid q changes into a single fetch after 200ms", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse(emptySearchResponse));
    globalThis.fetch = fetchMock;

    const { rerender } = renderHook(({ q }: { q: string }) => useSearch({ q }), {
      wrapper: wrapper(),
      initialProps: { q: "" },
    });

    // Initial render fires once with the empty q (no 200ms wait on mount).
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/proxy/search");

    // Three rapid keystrokes inside the debounce window — none should fire yet.
    rerender({ q: "f" });
    await vi.advanceTimersByTimeAsync(100);
    rerender({ q: "fr" });
    await vi.advanceTimersByTimeAsync(100);
    rerender({ q: "fra" });
    await vi.advanceTimersByTimeAsync(199);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // 200ms after the last keystroke — fires exactly once with the latest q.
    await vi.advanceTimersByTimeAsync(2);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const url = fetchMock.mock.calls[1][0] as string;
    expect(url).toContain("q=fra");
  });
});

describe("useTags / useOwners", () => {
  it("useTags fires immediately and returns FacetCount[]", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      jsonResponse([{ name: "fraud", count: 3 }]),
    );
    globalThis.fetch = fetchMock;

    const { result } = renderHook(() => useTags(), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/proxy/tags");
    expect(result.current.data).toEqual([{ name: "fraud", count: 3 }]);
  });

  it("useOwners fires immediately and returns FacetCount[]", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      jsonResponse([{ name: "alice@x", count: 2 }]),
    );
    globalThis.fetch = fetchMock;

    const { result } = renderHook(() => useOwners(), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchMock.mock.calls[0][0]).toBe("/api/proxy/owners");
    expect(result.current.data).toEqual([{ name: "alice@x", count: 2 }]);
  });
});
