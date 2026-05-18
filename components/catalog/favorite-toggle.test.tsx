import { describe, expect, it, beforeEach } from "vitest";
import { fireEvent, render, waitFor } from "@testing-library/react";
import { FavoriteToggle } from "./favorite-toggle";
import { FAVORITES_KEY } from "@/lib/catalog/local-store";

describe("FavoriteToggle", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("toggles favorite state and persists to localStorage", async () => {
    const { container } = render(<FavoriteToggle kind="featureset" name="users" />);
    await waitFor(() => expect(container.querySelector("button")).not.toBeNull());

    const button = container.querySelector("button")!;
    expect(button.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(button);

    await waitFor(() => {
      expect(button.getAttribute("aria-pressed")).toBe("true");
    });
    const stored = JSON.parse(window.localStorage.getItem(FAVORITES_KEY)!);
    expect(stored.items[0]).toMatchObject({ kind: "featureset", name: "users" });
  });

  it("a second click removes the favorite", async () => {
    const { container } = render(<FavoriteToggle kind="featureset" name="users" />);
    await waitFor(() => expect(container.querySelector("button")).not.toBeNull());
    const button = container.querySelector("button")!;

    fireEvent.click(button);
    await waitFor(() => expect(button.getAttribute("aria-pressed")).toBe("true"));

    fireEvent.click(button);
    await waitFor(() => expect(button.getAttribute("aria-pressed")).toBe("false"));

    const stored = JSON.parse(window.localStorage.getItem(FAVORITES_KEY)!);
    expect(stored.items).toEqual([]);
  });
});
