import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCatalogFilters } from "@/lib/hooks/use-catalog-filters";

const replace = vi.fn();
let mockSearch = "";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, push: vi.fn(), back: vi.fn(), forward: vi.fn() }),
  usePathname: () => "/catalog",
  useSearchParams: () => new URLSearchParams(mockSearch),
}));

beforeEach(() => {
  replace.mockClear();
  mockSearch = "";
});

describe("useCatalogFilters", () => {
  it("returns empty filters when URL has no query string", () => {
    const { result } = renderHook(() => useCatalogFilters());
    const [filters] = result.current;
    expect(filters).toEqual({ q: "", tags: [], owners: [] });
  });

  it("parses q, CSV tags, and CSV owners from the URL", () => {
    mockSearch = "q=frau&tags=fraud,realtime&owners=ml-platform,ds-team";
    const { result } = renderHook(() => useCatalogFilters());
    const [filters] = result.current;
    expect(filters).toEqual({
      q: "frau",
      tags: ["fraud", "realtime"],
      owners: ["ml-platform", "ds-team"],
    });
  });

  it("trims whitespace and drops empty CSV entries", () => {
    mockSearch = "tags=fraud,%20,realtime,";
    const { result } = renderHook(() => useCatalogFilters());
    const [filters] = result.current;
    expect(filters.tags).toEqual(["fraud", "realtime"]);
  });

  it("writes q via router.replace and preserves pathname", () => {
    const { result } = renderHook(() => useCatalogFilters());
    act(() => {
      result.current[1]({ q: "fraud" });
    });
    expect(replace).toHaveBeenCalledExactlyOnceWith("/catalog?q=fraud", {
      scroll: false,
    });
  });

  it("serialises tags array as a CSV", () => {
    const { result } = renderHook(() => useCatalogFilters());
    act(() => {
      result.current[1]({ tags: ["fraud", "realtime"] });
    });
    const [url, opts] = replace.mock.calls[0];
    expect(url).toBe("/catalog?tags=fraud%2Crealtime");
    expect(opts).toEqual({ scroll: false });
  });

  it("omits keys with empty values from the URL", () => {
    mockSearch = "q=fraud&tags=foo";
    const { result } = renderHook(() => useCatalogFilters());
    act(() => {
      result.current[1]({ q: "", tags: [] });
    });
    expect(replace).toHaveBeenCalledExactlyOnceWith("/catalog", {
      scroll: false,
    });
  });

  it("patch updates preserve other URL keys", () => {
    mockSearch = "q=fraud&owners=ml-platform";
    const { result } = renderHook(() => useCatalogFilters());
    act(() => {
      result.current[1]({ tags: ["realtime"] });
    });
    const [url] = replace.mock.calls[0];
    const params = new URLSearchParams(url.split("?")[1]);
    expect(params.get("q")).toBe("fraud");
    expect(params.get("owners")).toBe("ml-platform");
    expect(params.get("tags")).toBe("realtime");
  });

  it("emits a single router.replace per setFilters call (multi-key patch)", () => {
    const { result } = renderHook(() => useCatalogFilters());
    act(() => {
      result.current[1]({ q: "fraud", tags: ["realtime"], owners: ["ml"] });
    });
    expect(replace).toHaveBeenCalledTimes(1);
  });
});
