import type { LateFeeRule } from "./data";

export interface LateFeeInput {
  rule: LateFeeRule;
  monthlyRent: number;
  daysLate: number;
}

export interface LateFeeResult {
  /** True once the grace period has passed and a fee may be charged. */
  chargeable: boolean;
  graceDays: number;
  /** Maximum lawful fee, or null when the state has no fixed statutory cap. */
  maxFee: number | null;
  /** Human-readable explanation of the cap (or its absence). */
  explanation: string;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Computes the maximum lawful late fee for a state. Returns `maxFee: null` when
 * the state has no fixed cap (the fee must merely be "reasonable") — we never
 * invent a number the statute doesn't set.
 */
export function computeMaxLateFee(input: LateFeeInput): LateFeeResult {
  const { rule } = input;
  const rent = Math.max(0, input.monthlyRent || 0);
  const daysLate = Math.max(0, input.daysLate || 0);
  const chargeable = daysLate > rule.graceDays;

  let maxFee: number | null = null;
  let explanation = "";

  switch (rule.capType) {
    case "percent":
      maxFee = round2(rent * ((rule.capPercent ?? 0) / 100));
      explanation = `Up to ${rule.capPercent}% of the monthly rent.`;
      break;
    case "flat":
      maxFee = rule.capFlat ?? 0;
      explanation = `A flat maximum of $${rule.capFlat}.`;
      break;
    case "percent_or_flat": {
      const p = rent * ((rule.capPercent ?? 0) / 100);
      const f = rule.capFlat ?? 0;
      maxFee = round2(rule.combine === "greater" ? Math.max(p, f) : Math.min(p, f));
      explanation = `The ${rule.combine} of $${rule.capFlat} or ${rule.capPercent}% of rent.`;
      break;
    }
    case "reasonable":
    case "none":
      maxFee = null;
      explanation =
        "No fixed statutory cap — the fee must be reasonable and stated in the lease.";
      break;
  }

  return { chargeable, graceDays: rule.graceDays, maxFee, explanation };
}
