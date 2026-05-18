import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { OwnershipHealthPanel } from "./ownership-health-panel";
import type { SearchResponse } from "@/lib/types";

const isoAt = (msAgo: number) => new Date(Date.now() - msAgo).toISOString();

function emptyResponse(): SearchResponse {
  return {
    featuresets: [],
    datasets: [],
    pipelines: [],
    sources: [],
    tags: [],
    owners: [],
    projects: [],
  };
}

describe("OwnershipHealthPanel", () => {
  it("renders nothing for an owner with no metadata-bearing entities", () => {
    const { container } = render(<OwnershipHealthPanel data={emptyResponse()} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders freshness and documentation counts", () => {
    const data = emptyResponse();
    data.featuresets = [
      {
        id: "1",
        name: "fresh_fs",
        spec: { name: "fresh_fs", features: [], extractors: [] },
        metadata: {
          updated_at: isoAt(60 * 60 * 1000),
          description: "OK",
        },
      },
      {
        id: "2",
        name: "stale_fs",
        spec: { name: "stale_fs", features: [], extractors: [] },
        metadata: {
          updated_at: isoAt(3 * 86400 * 1000),
          tags: { team: "ml" },
        },
      },
      {
        id: "3",
        name: "undoc_fs",
        spec: { name: "undoc_fs", features: [], extractors: [] },
        metadata: {
          updated_at: isoAt(30 * 86400 * 1000),
        },
      },
    ];

    const { getByText, queryByText, container } = render(
      <OwnershipHealthPanel data={data} />,
    );

    // Header
    expect(getByText("Ownership health")).toBeTruthy();
    // Freshness chips: 1 fresh, 1 stale, 1 broken
    expect(getByText(/1 fresh/i)).toBeTruthy();
    expect(getByText(/1 stale/i)).toBeTruthy();
    expect(getByText(/1 broken/i)).toBeTruthy();
    // Documentation: scope to <li> rows so the description/tag rows are
    // distinguished by the trailing label.
    const liItems = Array.from(container.querySelectorAll("li")).map(
      (el) => el.textContent ?? "",
    );
    expect(liItems.some((t) => /1 \/ 3.*have descriptions/.test(t))).toBe(true);
    expect(liItems.some((t) => /1 \/ 3.*are tagged/.test(t))).toBe(true);
    expect(queryByText(/undocumented/)).not.toBeNull();
  });
});
