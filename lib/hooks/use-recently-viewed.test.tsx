import { describe, expect, it, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useRecentlyViewed } from "./use-recently-viewed";
import { RECENTLY_VIEWED_KEY, RECENTLY_VIEWED_CAP } from "@/lib/catalog/local-store";

describe("useRecentlyViewed", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("hydrates to empty when localStorage is empty", async () => {
    const { result } = renderHook(() => useRecentlyViewed());
    await act(async () => {});
    expect(result.current.recent).toEqual([]);
  });

  it("records new entities to the front", async () => {
    const { result } = renderHook(() => useRecentlyViewed());
    await act(async () => {});

    act(() => result.current.record("featureset", "a"));
    act(() => result.current.record("featureset", "b"));

    const names = result.current.recent!.map((it) => it.name);
    expect(names).toEqual(["b", "a"]);
  });

  it("bumps a re-recorded entity to the front (LRU)", async () => {
    const { result } = renderHook(() => useRecentlyViewed());
    await act(async () => {});

    act(() => result.current.record("featureset", "a"));
    act(() => result.current.record("featureset", "b"));
    act(() => result.current.record("featureset", "a"));

    const names = result.current.recent!.map((it) => it.name);
    expect(names).toEqual(["a", "b"]);
    expect(result.current.recent).toHaveLength(2);
  });

  it("caps the list at RECENTLY_VIEWED_CAP", async () => {
    const { result } = renderHook(() => useRecentlyViewed());
    await act(async () => {});

    for (let i = 0; i < RECENTLY_VIEWED_CAP + 3; i++) {
      // act-wrap each call to avoid React update warnings in tests
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      act(() => result.current.record("featureset", `fs${i}`));
    }

    expect(result.current.recent).toHaveLength(RECENTLY_VIEWED_CAP);
    // Most-recent should be at the front
    expect(result.current.recent![0].name).toBe(`fs${RECENTLY_VIEWED_CAP + 2}`);
  });

  it("persists to localStorage with the schema version", async () => {
    const { result } = renderHook(() => useRecentlyViewed());
    await act(async () => {});

    act(() => result.current.record("dataset", "events"));

    const stored = JSON.parse(window.localStorage.getItem(RECENTLY_VIEWED_KEY)!);
    expect(stored.version).toBe(1);
    expect(stored.items[0]).toMatchObject({ kind: "dataset", name: "events" });
  });
});
