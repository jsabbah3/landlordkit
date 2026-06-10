import type { DepositInterestRule } from "./data";

export interface DepositInterestInput {
  /** Total security deposit held, in dollars. */
  deposit: number;
  /** Number of whole/partial months the deposit has been held. */
  monthsHeld: number;
  /** Annual interest rate as a percentage (e.g. 5 for 5%). */
  annualRatePct: number;
  /** Interest only accrues after this many months (from the rule). */
  minHoldingMonths?: number;
  /**
   * Amount of the deposit exempt from interest (e.g. Ohio excludes the greater
   * of $50 or one month's rent). Interest is computed on (deposit - exempt).
   */
  exemptAmount?: number;
}

export interface DepositInterestResult {
  eligible: boolean;
  /** Reason interest is $0, when not eligible. */
  reason?: string;
  /** Portion of the deposit interest is actually computed on. */
  interestBase: number;
  /** Total simple interest owed, rounded to cents. */
  interest: number;
  /** deposit + interest. */
  totalDue: number;
  years: number;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Computes simple (non-compounded) security-deposit interest. Simple interest
 * is the standard across US states for deposits. Multi-year tenancies in states
 * that publish a new rate each year may owe a slightly different amount per
 * year — the UI surfaces that caveat for `published-annually` / `bank` rates.
 */
export function computeDepositInterest(
  input: DepositInterestInput,
): DepositInterestResult {
  const deposit = Math.max(0, input.deposit || 0);
  const months = Math.max(0, input.monthsHeld || 0);
  const rate = Math.max(0, input.annualRatePct || 0);
  const minMonths = Math.max(0, input.minHoldingMonths ?? 0);
  const exempt = Math.max(0, input.exemptAmount ?? 0);
  const years = months / 12;

  if (months < minMonths) {
    return {
      eligible: false,
      reason: `Interest does not begin until the deposit has been held at least ${minMonths} month${minMonths === 1 ? "" : "s"}.`,
      interestBase: 0,
      interest: 0,
      totalDue: round2(deposit),
      years,
    };
  }

  const interestBase = Math.max(0, deposit - exempt);
  const interest = round2(interestBase * (rate / 100) * years);
  return {
    eligible: true,
    interestBase: round2(interestBase),
    interest,
    totalDue: round2(deposit + interest),
    years,
  };
}

/** Resolve the exempt amount for a rule given an optional monthly rent. */
export function resolveExemptAmount(
  rule: Pick<DepositInterestRule, "exempt">,
  monthlyRent: number,
): number {
  if (!rule.exempt) return 0;
  const { fixed, orOneMonthRent } = rule.exempt;
  return orOneMonthRent ? Math.max(fixed, monthlyRent || 0) : fixed;
}
