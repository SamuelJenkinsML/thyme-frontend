import { describe, it, expect } from "vitest";
import type { QueryRun } from "@/lib/types";
import {
  hitBadge,
  kindVariant,
  previewEntities,
  relativeTime,
  shortRunId,
} from "@/lib/query-runs-utils";

function run(overrides: Partial<QueryRun> = {}): QueryRun {
  return {
    id: "run-1",
    featureset: "UserFeatures",
    entity_ids: ["u1"],
    requested_timestamp: null,
    kind: "online",
    row_count: 1,
    hit_count: 1,
    latency_ms: 12,
    api_key_fingerprint: null,
    error: null,
    created_at: "2026-04-21T12:00:00Z",
    ...overrides,
  };
}

describe("kindVariant", () => {
  it("maps online → default, batch → secondary, others → outline", () => {
    expect(kindVariant("online")).toBe("default");
    expect(kindVariant("batch")).toBe("secondary");
    expect(kindVariant("offline")).toBe("outline");
    expect(kindVariant("lookup")).toBe("outline");
  });
});

describe("hitBadge", () => {
  it("returns error for runs with an error set", () => {
    const badge = hitBadge(run({ error: "boom" }));
    expect(badge.label).toBe("error");
    expect(badge.color).toBe("destructive");
  });

  it("returns 0 rows for empty results", () => {
    const badge = hitBadge(run({ row_count: 0, hit_count: 0 }));
    expect(badge.label).toBe("0 rows");
    expect(badge.color).toBe("muted");
  });

  it("returns success when hit rate is 100%", () => {
    const badge = hitBadge(run({ row_count: 5, hit_count: 5 }));
    expect(badge.label).toBe("5/5");
    expect(badge.color).toBe("success");
  });

  it("returns warning when hit rate is partial", () => {
    const badge = hitBadge(run({ row_count: 10, hit_count: 3 }));
    expect(badge.label).toBe("3/10");
    expect(badge.color).toBe("warning");
  });
});

describe("previewEntities", () => {
  it("shows the full list when <= 3", () => {
    expect(previewEntities(["a", "b", "c"])).toBe("a, b, c");
  });

  it("shows first three and an overflow suffix when > 3", () => {
    expect(previewEntities(["a", "b", "c", "d", "e"])).toBe("a, b, c +2 more");
  });

  it("handles an empty list", () => {
    expect(previewEntities([])).toBe("");
  });
});

describe("relativeTime", () => {
  const now = new Date("2026-04-21T12:00:00Z").getTime();

  it("shows seconds", () => {
    expect(relativeTime("2026-04-21T11:59:30Z", now)).toBe("30s ago");
  });

  it("shows minutes", () => {
    expect(relativeTime("2026-04-21T11:55:00Z", now)).toBe("5m ago");
  });

  it("shows hours", () => {
    expect(relativeTime("2026-04-21T09:00:00Z", now)).toBe("3h ago");
  });

  it("shows days", () => {
    expect(relativeTime("2026-04-19T12:00:00Z", now)).toBe("2d ago");
  });

  it("returns 'just now' for future timestamps", () => {
    expect(relativeTime("2026-04-21T12:00:30Z", now)).toBe("just now");
  });

  it("returns the raw string for invalid dates", () => {
    expect(relativeTime("not-a-date", now)).toBe("not-a-date");
  });
});

describe("shortRunId", () => {
  it("truncates long ids to 8 chars", () => {
    expect(shortRunId("7b3e4c12-abc-def-123")).toBe("7b3e4c12");
  });

  it("returns the id unchanged when 8 or fewer chars", () => {
    expect(shortRunId("abc")).toBe("abc");
    expect(shortRunId("12345678")).toBe("12345678");
  });
});
