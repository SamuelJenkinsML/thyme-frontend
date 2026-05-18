import { describe, expect, it } from "vitest";
import { bucketFreshness, formatRelative } from "./freshness";

describe("bucketFreshness", () => {
  const now = new Date("2026-05-18T12:00:00Z");

  it("returns unknown for undefined / null / empty", () => {
    expect(bucketFreshness(undefined, now)).toBe("unknown");
    expect(bucketFreshness(null, now)).toBe("unknown");
    expect(bucketFreshness("", now)).toBe("unknown");
  });

  it("returns unknown for unparseable strings", () => {
    expect(bucketFreshness("not-a-date", now)).toBe("unknown");
    expect(bucketFreshness("2026-99-99", now)).toBe("unknown");
  });

  it("returns fresh for timestamps within 24h", () => {
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000).toISOString();
    expect(bucketFreshness(tenMinutesAgo, now)).toBe("fresh");

    const justUnder24h = new Date(now.getTime() - (24 * 60 * 60 * 1000 - 1)).toISOString();
    expect(bucketFreshness(justUnder24h, now)).toBe("fresh");
  });

  it("returns stale at the 24h boundary (strict less-than)", () => {
    const exactly24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    expect(bucketFreshness(exactly24h, now)).toBe("stale");

    const sixDays = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString();
    expect(bucketFreshness(sixDays, now)).toBe("stale");
  });

  it("returns broken at the 7d boundary and beyond", () => {
    const exactly7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    expect(bucketFreshness(exactly7d, now)).toBe("broken");

    const oneMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    expect(bucketFreshness(oneMonth, now)).toBe("broken");
  });

  it("treats future timestamps as fresh (clock skew tolerance)", () => {
    const future = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    expect(bucketFreshness(future, now)).toBe("fresh");
  });
});

describe("formatRelative", () => {
  const now = new Date("2026-05-18T12:00:00Z");

  it("renders seconds for sub-minute deltas", () => {
    const thirtySecAgo = new Date(now.getTime() - 30 * 1000).toISOString();
    expect(formatRelative(thirtySecAgo, now)).toMatch(/second/);
  });

  it("renders hours for sub-day deltas", () => {
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatRelative(threeHoursAgo, now)).toMatch(/hour/);
  });

  it("renders days for multi-day deltas", () => {
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelative(fiveDaysAgo, now)).toMatch(/day/);
  });

  it("returns 'never' for missing input", () => {
    expect(formatRelative(undefined, now)).toBe("never");
    expect(formatRelative(null, now)).toBe("never");
  });

  it("returns the raw string when unparseable", () => {
    expect(formatRelative("not-a-date", now)).toBe("not-a-date");
  });
});
