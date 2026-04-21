import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchQueryRun,
  fetchQueryRuns,
  replayQueryRun,
} from "@/lib/api/query-runs";

const originalFetch = globalThis.fetch;

function mockFetchOnce(body: unknown, status = 200) {
  const mock = vi.fn(
    async () =>
      new Response(typeof body === "string" ? body : JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      }),
  );
  globalThis.fetch = mock as unknown as typeof fetch;
  return mock;
}

beforeEach(() => {
  // Simulate client-side (proxy path) for all tests.
  // @ts-expect-error — jsdom-style window stub for typeof window check
  globalThis.window = {};
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  // @ts-expect-error — cleanup
  delete globalThis.window;
});

describe("fetchQueryRuns", () => {
  it("calls the proxy with no query string by default", async () => {
    const mock = mockFetchOnce({ runs: [] });
    await fetchQueryRuns();
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock.mock.calls[0][0]).toBe("/api/proxy/query-runs");
  });

  it("passes limit and featureset as query params", async () => {
    const mock = mockFetchOnce({ runs: [] });
    await fetchQueryRuns({ limit: 50, featureset: "UserFeatures" });
    const url = mock.mock.calls[0][0] as string;
    expect(url).toContain("/api/proxy/query-runs?");
    expect(url).toContain("limit=50");
    expect(url).toContain("featureset=UserFeatures");
  });

  it("throws on non-OK responses", async () => {
    mockFetchOnce("err", 500);
    await expect(fetchQueryRuns()).rejects.toThrow(/Failed to fetch query runs/);
  });
});

describe("fetchQueryRun", () => {
  it("encodes the id in the URL", async () => {
    const mock = mockFetchOnce({
      id: "abc/123",
      featureset: "f",
      entity_ids: [],
      requested_timestamp: null,
      kind: "online",
      row_count: 0,
      hit_count: 0,
      latency_ms: 0,
      api_key_fingerprint: null,
      error: null,
      created_at: "2026-01-01",
    });
    await fetchQueryRun("abc/123");
    expect(mock.mock.calls[0][0]).toBe("/api/proxy/query-runs/abc%2F123");
  });

  it("throws 'Query run not found' on 404", async () => {
    mockFetchOnce({ error: "nope" }, 404);
    await expect(fetchQueryRun("missing")).rejects.toThrow(/not found/);
  });
});

describe("replayQueryRun", () => {
  it("POSTs to the replay endpoint", async () => {
    const mock = mockFetchOnce({ kind: "batch", result: {} });
    await replayQueryRun("run-1");
    const [url, init] = mock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/proxy/query-runs/run-1/replay");
    expect(init.method).toBe("POST");
  });

  it("throws when replay fails", async () => {
    mockFetchOnce("boom", 500);
    await expect(replayQueryRun("run-1")).rejects.toThrow(/Replay failed/);
  });
});
