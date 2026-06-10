import { describe, it, expect } from "vitest";
import { computeDepositInterest, resolveExemptAmount } from "./calc";

describe("computeDepositInterest", () => {
  it("computes simple interest for a 1-year MA-style deposit (5%)", () => {
    const r = computeDepositInterest({
      deposit: 2000,
      monthsHeld: 12,
      annualRatePct: 5,
      minHoldingMonths: 12,
    });
    expect(r.eligible).toBe(true);
    expect(r.interest).toBe(100); // 2000 * 5% * 1yr
    expect(r.totalDue).toBe(2100);
  });

  it("prorates by months (simple interest, not compounded)", () => {
    const r = computeDepositInterest({
      deposit: 1200,
      monthsHeld: 6,
      annualRatePct: 5,
    });
    expect(r.interest).toBe(30); // 1200 * 5% * 0.5yr
  });

  it("returns $0 and a reason when below the minimum holding period", () => {
    const r = computeDepositInterest({
      deposit: 5000,
      monthsHeld: 8,
      annualRatePct: 5,
      minHoldingMonths: 12,
    });
    expect(r.eligible).toBe(false);
    expect(r.interest).toBe(0);
    expect(r.totalDue).toBe(5000);
    expect(r.reason).toMatch(/at least 12 months/);
  });

  it("computes interest only on the amount above an exempt threshold (OH)", () => {
    // Ohio: exclude greater of $50 or one month's rent. Rent $1000 -> exempt 1000.
    const exempt = resolveExemptAmount(
      { exempt: { fixed: 50, orOneMonthRent: true } },
      1000,
    );
    expect(exempt).toBe(1000);
    const r = computeDepositInterest({
      deposit: 1500,
      monthsHeld: 12,
      annualRatePct: 5,
      minHoldingMonths: 6,
      exemptAmount: exempt,
    });
    expect(r.interestBase).toBe(500); // 1500 - 1000
    expect(r.interest).toBe(25); // 500 * 5% * 1yr
  });

  it("uses the fixed $50 exemption when rent is lower", () => {
    const exempt = resolveExemptAmount(
      { exempt: { fixed: 50, orOneMonthRent: true } },
      40,
    );
    expect(exempt).toBe(50);
  });

  it("uses a fixed-only exemption regardless of rent (PA $100)", () => {
    const exempt = resolveExemptAmount(
      { exempt: { fixed: 100, orOneMonthRent: false } },
      2000,
    );
    expect(exempt).toBe(100);
  });

  it("rounds to cents", () => {
    const r = computeDepositInterest({
      deposit: 1333,
      monthsHeld: 7,
      annualRatePct: 3,
    });
    // 1333 * 0.03 * (7/12) = 23.3275 -> 23.33
    expect(r.interest).toBe(23.33);
  });

  it("handles zero / garbage input without throwing", () => {
    const r = computeDepositInterest({
      deposit: NaN,
      monthsHeld: -5,
      annualRatePct: -1,
    });
    expect(r.interest).toBe(0);
    expect(r.totalDue).toBe(0);
  });

  it("returns no exempt amount when the rule has none", () => {
    expect(resolveExemptAmount({ exempt: undefined }, 5000)).toBe(0);
  });
});
