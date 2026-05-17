import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { DeleteModal } from "@/components/catalog/delete-modal";

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

describe("DeleteModal", () => {
  it("blocks delete and lists consumers when dependents exist", async () => {
    globalThis.fetch = vi.fn<typeof fetch>(async (url) => {
      const u = String(url);
      if (u.endsWith("/dependents")) {
        return jsonResponse({
          kind: "featuresets",
          name: "users",
          dependents: [
            { kind: "pipelines", name: "scoring_pipe", edge_type: "pipeline_input" },
            { kind: "featuresets", name: "users_aug", edge_type: "featureset_dep" },
          ],
        });
      }
      // useFeaturesets — the inner DeprecateModal mounts unconditionally and
      // expects an array.
      return jsonResponse([]);
    });

    render(
      withClient(
        <DeleteModal open onOpenChange={() => {}} featuresetName="users" />,
      ),
    );

    await waitFor(() =>
      expect(screen.getByRole("alert").textContent).toMatch(/blocked/i),
    );
    // Both consumers listed
    expect(screen.getByText("scoring_pipe")).toBeTruthy();
    expect(screen.getByText("users_aug")).toBeTruthy();
    // CTA reads "Mark deprecated instead"
    expect(
      screen.getByRole("button", { name: /mark deprecated instead/i }),
    ).toBeTruthy();
  });

  it("no-dependents path: quick deprecate button works; hard-delete is disabled", async () => {
    const fetchMock = vi.fn<typeof fetch>(async (url) => {
      const u = String(url);
      if (u.endsWith("/dependents")) {
        return jsonResponse({ kind: "featuresets", name: "users", dependents: [] });
      }
      if (u.endsWith("/deprecate")) {
        return jsonResponse({
          name: "users",
          deprecated_at: "2026-05-18T00:00:00Z",
          deprecation_reason: null,
          replacement: null,
        });
      }
      // useFeaturesets fallback (in case the inner DeprecateModal mounts).
      return jsonResponse([]);
    });
    globalThis.fetch = fetchMock;

    const onOpenChange = vi.fn();
    const onDeprecated = vi.fn();

    render(
      withClient(
        <DeleteModal
          open
          onOpenChange={onOpenChange}
          featuresetName="users"
          onDeprecated={onDeprecated}
        />,
      ),
    );

    // Wait for the no-dependents view to render.
    const deprecateBtn = await screen.findByRole("button", {
      name: /^mark deprecated$/i,
    });
    const hardDelete = screen.getByRole("button", {
      name: /permanently delete/i,
    });
    expect((hardDelete as HTMLButtonElement).disabled).toBe(true);
    expect(hardDelete.getAttribute("title")).toMatch(/RBAC/i);

    // Click the quick deprecate button.
    fireEvent.click(deprecateBtn);
    await waitFor(() => expect(onDeprecated).toHaveBeenCalled());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    // The POSTed reason is the auto-generated "Removed from catalog on …"
    const postCall = fetchMock.mock.calls.find((c) =>
      String(c[0]).endsWith("/deprecate"),
    );
    expect(postCall).toBeDefined();
    const body = JSON.parse(postCall![1]?.body as string);
    expect(body.reason).toMatch(/Removed from catalog on \d{4}-\d{2}-\d{2}/);
  });
});
