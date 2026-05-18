import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { FreshnessPill } from "./freshness-pill";

describe("FreshnessPill", () => {
  it("renders null when bucket is unknown and no updatedAt", () => {
    const { container } = render(<FreshnessPill />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a fresh pill in emerald", () => {
    const { getByText } = render(<FreshnessPill bucket="fresh" />);
    const el = getByText("Fresh");
    expect(el.className).toContain("emerald");
  });

  it("renders a stale pill in amber", () => {
    const { getByText } = render(<FreshnessPill bucket="stale" />);
    expect(getByText("Stale").className).toContain("amber");
  });

  it("renders a broken pill in red", () => {
    const { getByText } = render(<FreshnessPill bucket="broken" />);
    expect(getByText("Broken").className).toContain("red");
  });

  it("includes a relative-time tooltip when updatedAt present", () => {
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const { container } = render(<FreshnessPill updatedAt={tenMinAgo} />);
    const pill = container.querySelector("[title]");
    expect(pill?.getAttribute("title")).toMatch(/Updated/);
  });

  it("derives bucket from updatedAt when bucket prop omitted", () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    const { getByText } = render(<FreshnessPill updatedAt={fiveDaysAgo} />);
    expect(getByText("Stale")).toBeTruthy();
  });
});
