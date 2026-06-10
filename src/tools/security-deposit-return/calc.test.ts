import { describe, it, expect } from "vitest";
import { computeDepositReturn } from "./calc";
import { DEPOSIT_RETURN } from "./data";

describe("computeDepositReturn", () => {
  it("subtracts deductions from the deposit", () => {
    const r = computeDepositReturn({
      deposit: 2000,
      deductions: [
        { description: "Carpet cleaning", amount: 150 },
        { description: "Unpaid rent", amount: 300 },
      ],
      rule: DEPOSIT_RETURN.CA,
    });
    expect(r.totalDeductions).toBe(450);
    expect(r.amountToReturn).toBe(1550);
    expect(r.hasDeductions).toBe(true);
  });

  it("never returns a negative amount", () => {
    const r = computeDepositReturn({
      deposit: 500,
      deductions: [{ description: "Damage", amount: 900 }],
      rule: DEPOSIT_RETURN.CA,
    });
    expect(r.amountToReturn).toBe(0);
  });

  it("uses the standard deadline when there are no deductions (CO 30)", () => {
    const r = computeDepositReturn({ deposit: 1000, deductions: [], rule: DEPOSIT_RETURN.CO });
    expect(r.deadlineDays).toBe(30);
  });

  it("uses the alternate deadline when deductions apply (CO 60)", () => {
    const r = computeDepositReturn({
      deposit: 1000,
      deductions: [{ description: "Repairs", amount: 100 }],
      rule: DEPOSIT_RETURN.CO,
    });
    expect(r.deadlineDays).toBe(60);
  });

  it("computes the deadline date from the move-out date (CA 21 days)", () => {
    const r = computeDepositReturn({
      deposit: 1000,
      deductions: [],
      moveOutISO: "2026-06-01",
      rule: DEPOSIT_RETURN.CA,
    });
    expect(r.deadlineDate?.getMonth()).toBe(5); // June
    expect(r.deadlineDate?.getDate()).toBe(22); // June 1 + 21 days
  });

  it("every state rule has a positive deadline", () => {
    for (const [code, rule] of Object.entries(DEPOSIT_RETURN)) {
      expect(rule.deadlineDays, code).toBeGreaterThan(0);
    }
  });
});
