import { describe, expect, it, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useFavorites } from "./use-favorites";
import { FAVORITES_KEY } from "@/lib/catalog/local-store";

describe("useFavorites", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("hydrates to empty array when localStorage is empty", async () => {
    const { result } = renderHook(() => useFavorites());
    await act(async () => {});
    expect(result.current.favorites).toEqual([]);
  });

  it("toggle adds an entity and persists", async () => {
    const { result } = renderHook(() => useFavorites());
    await act(async () => {});

    act(() => {
      result.current.toggle("featureset", "users");
    });

    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.favorites?.[0]).toMatchObject({
      kind: "featureset",
      name: "users",
    });
    expect(result.current.isFavorite("featureset", "users")).toBe(true);

    const stored = JSON.parse(window.localStorage.getItem(FAVORITES_KEY)!);
    expect(stored.items[0].name).toBe("users");
    expect(stored.version).toBe(1);
  });

  it("toggle removes an existing entity", async () => {
    const { result } = renderHook(() => useFavorites());
    await act(async () => {});

    act(() => {
      result.current.toggle("featureset", "users");
    });
    act(() => {
      result.current.toggle("featureset", "users");
    });

    expect(result.current.favorites).toEqual([]);
    expect(result.current.isFavorite("featureset", "users")).toBe(false);
  });

  it("toggle distinguishes between kinds", async () => {
    const { result } = renderHook(() => useFavorites());
    await act(async () => {});

    act(() => {
      result.current.toggle("featureset", "users");
    });
    act(() => {
      result.current.toggle("dataset", "users");
    });

    expect(result.current.favorites).toHaveLength(2);
    expect(result.current.isFavorite("featureset", "users")).toBe(true);
    expect(result.current.isFavorite("dataset", "users")).toBe(true);
  });

  it("recovers from corrupt localStorage", async () => {
    window.localStorage.setItem(FAVORITES_KEY, "{not valid json");
    const { result } = renderHook(() => useFavorites());
    await act(async () => {});
    expect(result.current.favorites).toEqual([]);
  });

  it("ignores items from a different schema version", async () => {
    window.localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify({ version: 99, items: [{ kind: "featureset", name: "old" }] }),
    );
    const { result } = renderHook(() => useFavorites());
    await act(async () => {});
    expect(result.current.favorites).toEqual([]);
  });
});
