import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchOwners, fetchSearch, fetchTags } from "@/lib/api/definition";

const originalFetch = globalThis.fetch;

function mockFetchOnce(body: unknown, status = 200) {
  const mock = vi.fn<typeof fetch>(
    async () =>
      new Response(typeof body === "string" ? body : JSON.stringify(body), {
        status,
        headers: { "content-type": "application/json" },
      }),
  );
  globalThis.fetch = mock;
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

const emptySearchResponse = {
  featuresets: [],
  datasets: [],
  pipelines: [],
  sources: [],
  tags: [],
  owners: [],
  projects: [],
};

describe("fetchSearch", () => {
  it("calls the proxy with no query string when params are empty", async () => {
    const mock = mockFetchOnce(emptySearchResponse);
    await fetchSearch({});
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock.mock.calls[0][0]).toBe("/api/proxy/search");
  });

  it("forwards q verbatim", async () => {
    const mock = mockFetchOnce(emptySearchResponse);
    await fetchSearch({ q: "frau" });
    expect(mock.mock.calls[0][0]).toBe("/api/proxy/search?q=frau");
  });

  it("joins array params with commas", async () => {
    const mock = mockFetchOnce(emptySearchResponse);
    await fetchSearch({
      kinds: ["featureset", "dataset"],
      tags: ["fraud", "team:ml"],
      owners: ["alice@x", "bob@x"],
    });
    const url = mock.mock.calls[0][0] as string;
    expect(url).toContain("kinds=featureset%2Cdataset");
    expect(url).toContain("tags=fraud%2Cteam%3Aml");
    expect(url).toContain("owners=alice%40x%2Cbob%40x");
  });

  it("omits empty arrays", async () => {
    const mock = mockFetchOnce(emptySearchResponse);
    await fetchSearch({ q: "x", kinds: [], tags: [] });
    const url = mock.mock.calls[0][0] as string;
    expect(url).toBe("/api/proxy/search?q=x");
  });

  it("forwards project and limit", async () => {
    const mock = mockFetchOnce(emptySearchResponse);
    await fetchSearch({ project: "risk", limit: 50 });
    const url = mock.mock.calls[0][0] as string;
    expect(url).toContain("project=risk");
    expect(url).toContain("limit=50");
  });

  it("throws on non-OK responses", async () => {
    mockFetchOnce("nope", 500);
    await expect(fetchSearch({})).rejects.toThrow(/Failed to fetch search/);
  });
});

describe("fetchTags / fetchOwners", () => {
  it("fetchTags hits /api/proxy/tags", async () => {
    const mock = mockFetchOnce([{ name: "fraud", count: 3 }]);
    const result = await fetchTags();
    expect(mock.mock.calls[0][0]).toBe("/api/proxy/tags");
    expect(result).toEqual([{ name: "fraud", count: 3 }]);
  });

  it("fetchOwners hits /api/proxy/owners", async () => {
    const mock = mockFetchOnce([{ name: "alice@x", count: 2 }]);
    const result = await fetchOwners();
    expect(mock.mock.calls[0][0]).toBe("/api/proxy/owners");
    expect(result).toEqual([{ name: "alice@x", count: 2 }]);
  });

  it("fetchTags throws on non-OK", async () => {
    mockFetchOnce("server error", 500);
    await expect(fetchTags()).rejects.toThrow(/Failed to fetch tags/);
  });

  it("fetchOwners throws on non-OK", async () => {
    mockFetchOnce("server error", 503);
    await expect(fetchOwners()).rejects.toThrow(/Failed to fetch owners/);
  });
});
