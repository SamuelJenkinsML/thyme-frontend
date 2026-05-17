import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { DeprecateModal } from "@/components/catalog/deprecate-modal";

const originalFetch = globalThis.fetch;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function withClient(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return <QueryClientProvider client={client}>{ui}</QueryClientProvider>;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("DeprecateModal", () => {
  it("submit is disabled until a non-blank reason is entered", async () => {
    // useFeaturesets fires on mount — return empty list so the autocomplete
    // datalist has no entries.
    globalThis.fetch = vi.fn<typeof fetch>(async () => jsonResponse([]));

    render(
      withClient(
        <DeprecateModal
          open
          onOpenChange={() => {}}
          featuresetName="users"
        />,
      ),
    );

    const submit = await screen.findByRole("button", {
      name: /mark deprecated/i,
    });
    expect((submit as HTMLButtonElement).disabled).toBe(true);

    const reason = screen.getByPlaceholderText(/why is this featureset/i);
    fireEvent.change(reason, { target: { value: "Replaced by users_v2" } });
    expect((submit as HTMLButtonElement).disabled).toBe(false);
  });

  it("posts reason + trimmed replacement and closes on success", async () => {
    const fetchMock = vi.fn<typeof fetch>(async (url) => {
      if (String(url).endsWith("/featuresets") || String(url).endsWith("/api/proxy/featuresets")) {
        return jsonResponse([
          { id: "1", name: "users_v2", spec: { name: "users_v2", features: [], extractors: [] } },
        ]);
      }
      return jsonResponse({
        name: "users",
        deprecated_at: "2026-05-18T00:00:00Z",
        deprecation_reason: "replaced",
        replacement: "users_v2",
      });
    });
    globalThis.fetch = fetchMock;

    const onOpenChange = vi.fn();
    const onDeprecated = vi.fn();
    render(
      withClient(
        <DeprecateModal
          open
          onOpenChange={onOpenChange}
          featuresetName="users"
          onDeprecated={onDeprecated}
        />,
      ),
    );

    fireEvent.change(screen.getByPlaceholderText(/why is this featureset/i), {
      target: { value: "  replaced  " },
    });
    fireEvent.change(screen.getByPlaceholderText("users_v2"), {
      target: { value: "  users_v2  " },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /mark deprecated/i }),
    );

    await waitFor(() => expect(onDeprecated).toHaveBeenCalled());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    // The POST call body
    const postCall = fetchMock.mock.calls.find(
      (c) => String(c[0]).endsWith("/deprecate"),
    );
    expect(postCall).toBeDefined();
    expect(JSON.parse(postCall![1]?.body as string)).toEqual({
      reason: "replaced",
      replacement: "users_v2",
    });
  });

  it("renders mutation errors inline", async () => {
    globalThis.fetch = vi.fn<typeof fetch>(async (url) => {
      if (
        String(url).endsWith("/featuresets") ||
        String(url).endsWith("/api/proxy/featuresets")
      ) {
        return jsonResponse([]);
      }
      return jsonResponse({ error: "boom" }, 500);
    });

    render(
      withClient(
        <DeprecateModal
          open
          onOpenChange={() => {}}
          featuresetName="users"
        />,
      ),
    );

    fireEvent.change(screen.getByPlaceholderText(/why is this featureset/i), {
      target: { value: "test" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /mark deprecated/i }),
    );

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toMatch(/failed/i),
    );
  });
});
