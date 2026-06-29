import { formatDate, daysUntil } from "../date";

describe("formatDate", () => {
  it("formats an ISO date string", () => {
    expect(formatDate("2026-05-13T00:00:00.000Z")).toMatch(/2026/);
  });

  it("returns a dash for null/undefined", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
  });
});

describe("daysUntil", () => {
  it("returns a positive number for a future date", () => {
    const future = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(daysUntil(future)).toBeGreaterThanOrEqual(4);
  });

  it("returns a negative number for a past date", () => {
    const past = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    expect(daysUntil(past)).toBeLessThan(0);
  });
});
