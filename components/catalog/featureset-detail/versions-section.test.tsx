import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { VersionsSection } from "@/components/catalog/featureset-detail/versions-section";

const originalFetch = globalThis.fetch;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function withClient(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return <QueryClientProvider client={client}>{ui}</QueryClientProvider>;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("VersionsSection", () => {
  it("shows empty-state copy when the featureset has no versions yet", async () => {
    globalThis.fetch = vi.fn<typeof fetch>(async () =>
      jsonResponse({ name: "users", versions: [] }),
    );
    render(withClient(<VersionsSection featuresetName="users" />));
    await waitFor(() =>
      expect(screen.getByText(/No version history yet/i)).toBeTruthy(),
    );
  });

  it("renders one row per version with newest first and a 'latest' badge", async () => {
    globalThis.fetch = vi.fn<typeof fetch>(async () =>
      jsonResponse({
        name: "users",
        versions: [
          {
            version: 3,
            parent_version: 2,
            created_at: "2026-05-18T00:00:00Z",
            graph_commit_id: null,
          },
          {
            version: 2,
            parent_version: 1,
            created_at: "2026-05-17T00:00:00Z",
            graph_commit_id: null,
          },
          {
            version: 1,
            parent_version: null,
            created_at: "2026-05-16T00:00:00Z",
            graph_commit_id: null,
          },
        ],
      }),
    );
    render(withClient(<VersionsSection featuresetName="users" />));
    await waitFor(() => expect(screen.getByText("v3")).toBeTruthy());

    // All three rows visible
    expect(screen.getByText("v3")).toBeTruthy();
    expect(screen.getByText("v2")).toBeTruthy();
    expect(screen.getByText("v1")).toBeTruthy();
    // Only the newest gets the "latest" badge
    expect(screen.getAllByText(/latest/i)).toHaveLength(1);
    // v1 is the initial version (no parent)
    expect(screen.getByText(/initial/i)).toBeTruthy();
  });

  it("renders a Compare link pointing to /diff?from=parent&to=v for non-initial rows", async () => {
    globalThis.fetch = vi.fn<typeof fetch>(async () =>
      jsonResponse({
        name: "users",
        versions: [
          {
            version: 2,
            parent_version: 1,
            created_at: "2026-05-18T00:00:00Z",
            graph_commit_id: null,
          },
          {
            version: 1,
            parent_version: null,
            created_at: "2026-05-17T00:00:00Z",
            graph_commit_id: null,
          },
        ],
      }),
    );
    render(withClient(<VersionsSection featuresetName="users" />));
    await waitFor(() => expect(screen.getByText(/v1 → v2/)).toBeTruthy());
    const link = screen.getByText(/v1 → v2/).closest("a");
    expect(link?.getAttribute("href")).toBe(
      "/catalog/featuresets/users/diff?from=1&to=2",
    );
  });
});
