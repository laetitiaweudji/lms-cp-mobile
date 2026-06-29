import { totalPages } from "../pagination";

describe("totalPages", () => {
  it("computes total pages for an exact multiple", () => {
    expect(totalPages(40, 20)).toBe(2);
  });

  it("rounds up for a partial last page", () => {
    expect(totalPages(41, 20)).toBe(3);
  });

  it("returns 1 when there are zero items", () => {
    expect(totalPages(0, 20)).toBe(1);
  });

  it("returns 1 for a non-positive page size instead of dividing by zero", () => {
    expect(totalPages(40, 0)).toBe(1);
    expect(totalPages(40, -5)).toBe(1);
  });
});
