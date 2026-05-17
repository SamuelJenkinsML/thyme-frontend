import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SchemaDiff } from "@/components/catalog/versions/schema-diff";
import type { FeaturesetDiff } from "@/lib/types";

function emptyDiff(from = 1, to = 2): FeaturesetDiff {
  return {
    name: "users",
    from,
    to,
    added: [],
    removed: [],
    changed: [],
    extractors_added: [],
    extractors_removed: [],
    extractors_changed: [],
  };
}

describe("SchemaDiff", () => {
  it("renders the no-differences card when every list is empty", () => {
    render(<SchemaDiff diff={emptyDiff()} />);
    expect(screen.getByText(/No differences/i)).toBeTruthy();
    expect(
      screen.getByText(/v1 and v2 have identical specs/i),
    ).toBeTruthy();
  });

  it("renders added / removed / changed feature rows with appropriate labels", () => {
    const diff: FeaturesetDiff = {
      ...emptyDiff(),
      added: [{ name: "session_count", dtype: "int" }],
      removed: [{ name: "legacy_flag", dtype: "bool" }],
      changed: [{ name: "score", from_dtype: "int", to_dtype: "float" }],
    };
    render(<SchemaDiff diff={diff} />);
    // One badge per change type
    expect(screen.getByText(/^added$/)).toBeTruthy();
    expect(screen.getByText(/^removed$/)).toBeTruthy();
    expect(screen.getByText(/^changed$/)).toBeTruthy();
    // Feature names rendered
    expect(screen.getByText("session_count")).toBeTruthy();
    expect(screen.getByText("legacy_flag")).toBeTruthy();
    expect(screen.getByText("score")).toBeTruthy();
    // No extractors panel when no extractor changes
    expect(screen.queryByText(/Extractors/i)).toBeNull();
  });

  it("renders the extractors panel only when extractor changes are present", () => {
    const diff: FeaturesetDiff = {
      ...emptyDiff(),
      extractors_added: ["new_ext"],
      extractors_removed: ["old_ext"],
      extractors_changed: ["modified_ext"],
    };
    render(<SchemaDiff diff={diff} />);
    expect(screen.getByText(/Extractors/i)).toBeTruthy();
    expect(screen.getByText("new_ext")).toBeTruthy();
    expect(screen.getByText("old_ext")).toBeTruthy();
    expect(screen.getByText("modified_ext")).toBeTruthy();
  });

  it("renders dtype transition for changed features", () => {
    const diff: FeaturesetDiff = {
      ...emptyDiff(),
      changed: [{ name: "score", from_dtype: "int", to_dtype: "float" }],
    };
    const { container } = render(<SchemaDiff diff={diff} />);
    // The from_dtype and to_dtype are rendered as adjacent spans inside the
    // same parent — assert both literal strings appear.
    expect(screen.getByText("int")).toBeTruthy();
    expect(screen.getByText("float")).toBeTruthy();
    // And the arrow lives in the same cell so the cell's text is the
    // combined transition.
    expect(container.textContent).toContain("int → float");
  });
});
