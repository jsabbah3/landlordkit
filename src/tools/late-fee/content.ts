import type { USState } from "@/lib/states";
import type { LateFeeRule } from "./data";

export function buildSummary(state: USState, rule: LateFeeRule): string {
  const cap =
    rule.capType === "percent"
      ? `The late fee is capped at ${rule.capPercent}% of the monthly rent.`
      : rule.capType === "flat"
        ? `The late fee is capped at $${rule.capFlat}.`
        : rule.capType === "percent_or_flat"
          ? `The late fee is capped at the ${rule.combine} of $${rule.capFlat} or ${rule.capPercent}% of the monthly rent.`
          : `${state.name} sets no fixed late-fee cap — the fee must be reasonable and written into the lease.`;
  const grace =
    rule.graceDays > 0
      ? ` A late fee may not be charged until the rent is more than ${rule.graceDays} day${rule.graceDays === 1 ? "" : "s"} late.`
      : " There is no statutory grace period, but the lease may provide one.";
  return `${cap}${grace}`;
}

export function buildFaqs(
  state: USState,
  rule: LateFeeRule,
): { q: string; a: string }[] {
  return [
    {
      q: `What is the maximum late fee a landlord can charge in ${state.name}?`,
      a:
        rule.capType === "reasonable" || rule.capType === "none"
          ? `${state.name} has no fixed statutory cap. The late fee must be reasonable and stated in the lease. ${rule.notes ?? ""} (${rule.cite.statute}).`
          : `${buildSummary(state, rule)} (${rule.cite.statute}).`,
    },
    {
      q: `Is there a grace period for late rent in ${state.name}?`,
      a:
        rule.graceDays > 0
          ? `Yes — a late fee cannot be charged until the rent is more than ${rule.graceDays} days late.`
          : `${state.name} sets no statutory grace period, though your lease may include one.`,
    },
    {
      q: `Can a late fee exceed the legal cap if the lease says so?`,
      a: "No. A lease clause that sets a late fee above the state's legal limit is generally void and unenforceable, even if the tenant signed it.",
    },
    {
      q: `Is this late fee calculator free?`,
      a: "Yes — it's free and requires no signup.",
    },
  ];
}

export const TOOL_META = {
  h1: "Rent Late Fee Calculator",
  intro:
    "Check your state's legal late-fee cap and grace period, then calculate a compliant late fee. Charging more than the cap can make the whole fee unenforceable — so get it right. Free, no signup.",
};
