import { describe, it, expect } from "vitest";
import {
  computeProratedRent,
  daysInMonth,
  daysFromMoveIn,
} from "./calc";

describe("computeProratedRent", () => {
  it("actual-days: $1200 rent, 21 days in a 30-day month", () => {
    const r = computeProratedRent({ monthlyRent: 1200, daysOccupied: 21, daysInMonth: 30, method: "actual-days" });
    expect(r.dailyRate).toBe(40);
    expect(r.proratedRent).toBe(840);
  });

  it("actual-days adjusts for a 31-day month", () => {
    const r = computeProratedRent({ monthlyRent: 1550, daysOccupied: 10, daysInMonth: 31, method: "actual-days" });
    expect(r.dailyRate).toBe(50); // 1550 / 31
    expect(r.proratedRent).toBe(500);
  });

  it("thirty-day method always divides by 30", () => {
    const r = computeProratedRent({ monthlyRent: 1500, daysOccupied: 15, daysInMonth: 28, method: "thirty-day" });
    expect(r.dailyRate).toBe(50);
    expect(r.proratedRent).toBe(750);
  });

  it("banker-year divides annual rent by 365", () => {
    const r = computeProratedRent({ monthlyRent: 1000, daysOccupied: 10, daysInMonth: 31, method: "banker-year" });
    expect(r.dailyRate).toBe(32.88); // 12000/365 = 32.876...
    expect(r.proratedRent).toBe(328.77); // 32.876712 * 10
  });
});

describe("date helpers", () => {
  it("daysInMonth handles February in a leap year", () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2026, 2)).toBe(28);
  });

  it("daysFromMoveIn counts the move-in day through month end", () => {
    expect(daysFromMoveIn(2026, 6, 10)).toBe(21); // June has 30 days; 30-10+1
    expect(daysFromMoveIn(2026, 1, 1)).toBe(31);
  });
});
