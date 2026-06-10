import { describe, it, expect } from "vitest";
import { computeMaxLateFee } from "./calc";
import { LATE_FEE } from "./data";

describe("computeMaxLateFee", () => {
  it("applies a percent cap (Maine 4%)", () => {
    const r = computeMaxLateFee({ rule: LATE_FEE.ME, monthlyRent: 1000, daysLate: 20 });
    expect(r.maxFee).toBe(40);
    expect(r.chargeable).toBe(true);
  });

  it("respects the grace period (Maine 15 days)", () => {
    const r = computeMaxLateFee({ rule: LATE_FEE.ME, monthlyRent: 1000, daysLate: 10 });
    expect(r.chargeable).toBe(false);
  });

  it("takes the lesser of flat or percent (NY: $50 or 5%)", () => {
    const low = computeMaxLateFee({ rule: LATE_FEE.NY, monthlyRent: 800, daysLate: 10 });
    expect(low.maxFee).toBe(40); // 5% of 800 = 40 < 50
    const high = computeMaxLateFee({ rule: LATE_FEE.NY, monthlyRent: 2000, daysLate: 10 });
    expect(high.maxFee).toBe(50); // 5% of 2000 = 100, capped at $50
  });

  it("takes the greater of flat or percent (NC: $15 or 5%)", () => {
    const r = computeMaxLateFee({ rule: LATE_FEE.NC, monthlyRent: 200, daysLate: 10 });
    expect(r.maxFee).toBe(15); // 5% of 200 = 10, but $15 floor wins
  });

  it("returns null max when the state has no fixed cap", () => {
    const r = computeMaxLateFee({ rule: LATE_FEE.CA, monthlyRent: 2000, daysLate: 10 });
    expect(r.maxFee).toBeNull();
    expect(r.explanation).toMatch(/reasonable/i);
  });

  it("every state rule has a non-negative grace period", () => {
    for (const [code, rule] of Object.entries(LATE_FEE)) {
      expect(rule.graceDays, code).toBeGreaterThanOrEqual(0);
    }
  });
});
