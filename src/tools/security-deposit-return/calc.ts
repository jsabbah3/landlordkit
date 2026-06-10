import { parseISODate } from "@/lib/format";
import type { DepositReturnRule } from "./data";

export interface Deduction {
  description: string;
  amount: number;
}

export interface ReturnInput {
  deposit: number;
  deductions: Deduction[];
  moveOutISO?: string;
  rule: DepositReturnRule;
}

export interface ReturnResult {
  totalDeductions: number;
  amountToReturn: number;
  /** Whether deductions were taken (affects the deadline in some states). */
  hasDeductions: boolean;
  deadlineDays: number;
  /** Computed return deadline date (moveOut + deadlineDays), if a date given. */
  deadlineDate: Date | null;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

export function computeDepositReturn(input: ReturnInput): ReturnResult {
  const deposit = Math.max(0, input.deposit || 0);
  const totalDeductions = round2(
    input.deductions.reduce((sum, d) => sum + (Number(d.amount) || 0), 0),
  );
  const hasDeductions = totalDeductions > 0;
  const amountToReturn = round2(Math.max(0, deposit - totalDeductions));

  // Some states allow a longer deadline when deductions are taken.
  const deadlineDays =
    hasDeductions && input.rule.deadlineDaysIfDeducting != null
      ? input.rule.deadlineDaysIfDeducting
      : input.rule.deadlineDays;

  let deadlineDate: Date | null = null;
  const moveOut = input.moveOutISO ? parseISODate(input.moveOutISO) : null;
  if (moveOut) {
    deadlineDate = new Date(moveOut);
    deadlineDate.setDate(deadlineDate.getDate() + deadlineDays);
  }

  return {
    totalDeductions,
    amountToReturn,
    hasDeductions,
    deadlineDays,
    deadlineDate,
  };
}
