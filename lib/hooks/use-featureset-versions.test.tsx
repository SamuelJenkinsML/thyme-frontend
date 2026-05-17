import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  useFeaturesetDiff,
  useFeaturesetVersion,
  useFeaturesetVersions,
} from "@/lib/hooks/use-featureset-versions";

const originalFetch = globalThis.fetch;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function wrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

beforeEach(() => {
  // Reset fetch between tests.
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("useFeaturesetVersions", () => {
  it("hits the proxy and returns the versions array", async () => {
    const body = {
      name: "users",
      versions: [
        { version: 2, parent_version: 1, created_at: "2026-05-18T00:00:00Z", graph_commit_id: null },
        { version: 1, parent_version: null, created_at: "2026-05-17T00:00:00Z", graph_commit_id: null },
      ],
    };
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse(body));
    globalThis.fetch = fetchMock;

    const { result } = renderHook(() => useFeaturesetVersions("users"), {
      wrapper: wrapper(),
    });
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data?.versions).toHaveLength(2);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/proxy/featuresets/users/versions");
  });

  it("is disabled when name is empty", () => {
    const fetchMock = vi.fn<typeof fetch>();
    globalThis.fetch = fetchMock;
    const { result } = renderHook(() => useFeaturesetVersions(""), {
      wrapper: wrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("useFeaturesetVersion", () => {
  it("fetches a single version detail", async () => {
    const body = {
      name: "users",
      version: 2,
      parent_version: 1,
      spec: { name: "users", features: [], extractors: [] },
      metadata: {},
      created_at: "2026-05-18T00:00:00Z",
      graph_commit_id: null,
    };
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse(body));
    globalThis.fetch = fetchMock;

    const { result } = renderHook(() => useFeaturesetVersion("users", 2), {
      wrapper: wrapper(),
    });
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data?.version).toBe(2);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/proxy/featuresets/users/versions/2");
  });

  it("is disabled when version is null", () => {
    const fetchMock = vi.fn<typeof fetch>();
    globalThis.fetch = fetchMock;
    const { result } = renderHook(() => useFeaturesetVersion("users", null), {
      wrapper: wrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("useFeaturesetDiff", () => {
  it("forwards from + to as query params", async () => {
    const body = {
      name: "users",
      from: 1,
      to: 2,
      added: [],
      removed: [],
      changed: [],
      extractors_added: [],
      extractors_removed: [],
      extractors_changed: [],
    };
    const fetchMock = vi.fn<typeof fetch>(async () => jsonResponse(body));
    globalThis.fetch = fetchMock;

    const { result } = renderHook(() => useFeaturesetDiff("users", 1, 2), {
      wrapper: wrapper(),
    });
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(fetchMock.mock.calls[0][0]).toBe(
      "/api/proxy/featuresets/users/diff?from=1&to=2",
    );
  });

  it("is disabled when from === to", () => {
    const fetchMock = vi.fn<typeof fetch>();
    globalThis.fetch = fetchMock;
    const { result } = renderHook(() => useFeaturesetDiff("users", 1, 1), {
      wrapper: wrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is disabled when either bound is null", () => {
    const fetchMock = vi.fn<typeof fetch>();
    globalThis.fetch = fetchMock;
    const { result } = renderHook(() => useFeaturesetDiff("users", null, 2), {
      wrapper: wrapper(),
    });
    expect(result.current.fetchStatus).toBe("idle");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
