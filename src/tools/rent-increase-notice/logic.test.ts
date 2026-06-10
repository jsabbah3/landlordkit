import { describe, it, expect } from "vitest";
import { computeRequiredNotice, earliestEffectiveDate } from "./logic";
import { getRentIncreaseRule, RENT_INCREASE } from "./data";

const CA = RENT_INCREASE.CA;
const NY = RENT_INCREASE.NY;
const TX = RENT_INCREASE.TX;

describe("computeRequiredNotice", () => {
  it("uses the base notice period for a small increase", () => {
    const r = computeRequiredNotice({ rule: CA, currentRent: 2000, newRent: 2100 });
    expect(r.increasePct).toBe(5);
    expect(r.requiredNoticeDays).toBe(30);
    expect(r.governingNotes).toHaveLength(0);
  });

  it("applies CA's 90-day tier for increases over 10%", () => {
    const r = computeRequiredNotice({ rule: CA, currentRent: 2000, newRent: 2300 });
    expect(r.increasePct).toBe(15);
    expect(r.requiredNoticeDays).toBe(90);
    expect(r.governingNotes[0]).toMatch(/90 days/);
  });

  it("scales NY notice with tenancy length (max of matching tiers)", () => {
    const short = computeRequiredNotice({ rule: NY, currentRent: 1000, newRent: 1100, tenancyMonths: 6 });
    expect(short.requiredNoticeDays).toBe(30);

    const mid = computeRequiredNotice({ rule: NY, currentRent: 1000, newRent: 1100, tenancyMonths: 18 });
    expect(mid.requiredNoticeDays).toBe(60);

    const long = computeRequiredNotice({ rule: NY, currentRent: 1000, newRent: 1100, tenancyMonths: 30 });
    expect(long.requiredNoticeDays).toBe(90);
  });

  it("computes the increase amount and percent", () => {
    const r = computeRequiredNotice({ rule: TX, currentRent: 1500, newRent: 1650 });
    expect(r.increaseAmount).toBe(150);
    expect(r.increasePct).toBe(10);
  });

  it("handles zero current rent without dividing by zero", () => {
    const r = computeRequiredNotice({ rule: TX, currentRent: 0, newRent: 1000 });
    expect(r.increasePct).toBe(0);
    expect(r.requiredNoticeDays).toBe(30);
  });

  it("every state in the registry has a positive base notice period", () => {
    for (const [code, rule] of Object.entries(RENT_INCREASE)) {
      expect(rule.baseNoticeDays, code).toBeGreaterThan(0);
      expect(getRentIncreaseRule(code)).toBe(rule);
    }
  });
});

describe("earliestEffectiveDate", () => {
  it("adds the notice days to the start date", () => {
    const d = earliestEffectiveDate(60, "2026-01-01");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(2); // March (0-indexed): Jan 1 + 60 days = Mar 2
    expect(d.getDate()).toBe(2);
  });
});
