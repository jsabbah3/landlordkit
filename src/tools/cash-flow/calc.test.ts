import { describe, it, expect } from "vitest";
import { computeCashFlow, monthlyMortgagePayment } from "./calc";

describe("monthlyMortgagePayment", () => {
  it("computes a standard amortized payment (160k, 7%, 30yr)", () => {
    const m = monthlyMortgagePayment(160000, 7, 30);
    expect(m).toBeGreaterThan(1064);
    expect(m).toBeLessThan(1065); // ≈ $1064.48
  });

  it("handles a 0% loan as principal / months", () => {
    expect(monthlyMortgagePayment(120000, 0, 30)).toBe(333.33);
  });

  it("returns 0 when there is no term", () => {
    expect(monthlyMortgagePayment(100000, 5, 0)).toBe(0);
  });
});

describe("computeCashFlow", () => {
  const base = {
    purchasePrice: 200000,
    downPaymentPct: 20,
    interestRatePct: 7,
    loanTermYears: 30,
    closingCosts: 6000,
    rehabCosts: 4000,
    monthlyRent: 2000,
    otherMonthlyIncome: 0,
    vacancyPct: 5,
    propertyTaxAnnual: 2400,
    insuranceAnnual: 1200,
    hoaMonthly: 0,
    maintenancePct: 5,
    managementPct: 8,
    capexPct: 5,
    otherMonthlyExpense: 0,
  };

  it("derives loan amount and down payment", () => {
    const r = computeCashFlow(base);
    expect(r.downPayment).toBe(40000);
    expect(r.loanAmount).toBe(160000);
    expect(r.totalCashInvested).toBe(50000); // 40k + 6k + 4k
  });

  it("computes effective income after vacancy", () => {
    const r = computeCashFlow(base);
    expect(r.effectiveGrossIncome).toBe(1900); // 2000 - 5%
  });

  it("computes positive metrics with sensible ranges", () => {
    const r = computeCashFlow(base);
    expect(r.noiAnnual).toBeGreaterThan(0);
    expect(r.capRatePct).toBeGreaterThan(0);
    // NOI = 1900 - (200 tax + 100 ins + 100 maint + 152 mgmt + 100 capex) = 1248/mo
    expect(r.noiMonthly).toBe(1248);
    expect(r.capRatePct).toBe(7.49); // 1248*12 / 200000
  });

  it("computes cash-on-cash from annual cash flow and cash invested", () => {
    const r = computeCashFlow(base);
    const expected = Math.round((r.annualCashFlow / 50000) * 100 * 100) / 100;
    expect(r.cashOnCashPct).toBe(expected);
  });

  it("avoids division by zero", () => {
    const r = computeCashFlow({ ...base, purchasePrice: 0, downPaymentPct: 0, closingCosts: 0, rehabCosts: 0 });
    expect(r.capRatePct).toBe(0);
    expect(r.cashOnCashPct).toBe(0);
  });
});
