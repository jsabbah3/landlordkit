import { usd, percent } from "@/lib/format";
import type { USState } from "@/lib/states";
import type { DepositInterestRule } from "./data";
import { computeDepositInterest, resolveExemptAmount } from "./calc";

/** Stable, useful FAQ entries for a given state — used for on-page content
 *  AND FAQPage JSON-LD. Genuinely state-specific so pages aren't thin. */
export function buildFaqs(
  state: USState,
  rule: DepositInterestRule,
): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];

  faqs.push({
    q: `Do landlords have to pay interest on security deposits in ${state.name}?`,
    a:
      rule.required === "no"
        ? `No. ${state.name} has no statewide law requiring landlords to pay interest on security deposits. Individual cities may have their own ordinances, and a lease can still promise interest.`
        : `Yes. ${rule.summary} (${rule.cite.statute}).`,
  });

  if (rule.required !== "no") {
    faqs.push({
      q: `How is security deposit interest calculated in ${state.name}?`,
      a: `Interest is simple (non-compounded). Multiply the deposit${
        rule.exempt ? " above the exempt amount" : ""
      } by the annual rate and by the number of years held. ${
        rule.minHoldingMonths > 0
          ? `Interest only begins after the deposit has been held ${rule.minHoldingMonths} months.`
          : "Interest accrues from the start of the tenancy."
      }`,
    });

    faqs.push({
      q: `When must ${state.name} landlords pay the interest to the tenant?`,
      a: rule.payTiming,
    });

    if (rule.appliesTo) {
      faqs.push({
        q: `Does the ${state.name} security deposit interest law apply to every rental?`,
        a: `Not necessarily. ${rule.appliesTo} Check the statute (${rule.cite.statute}) for the exact scope.`,
      });
    }
  }

  faqs.push({
    q: `Is the LandlordKit security deposit interest calculator free?`,
    a: "Yes — it's completely free, requires no signup, and you can download a PDF interest statement to give your tenant.",
  });

  return faqs;
}

/** A concrete worked example using the state's own rate, for the page body. */
export function buildExample(state: USState, rule: DepositInterestRule): string {
  if (rule.required === "no") {
    return `Because ${state.name} has no statewide interest requirement, a landlord holding a $1,500 deposit for two years generally owes $0 in interest — though the lease or a local ordinance could change that.`;
  }
  const deposit = 1500;
  const monthlyRent = 1000;
  const rate = rule.defaultRatePct ?? 1;
  const exemptAmount = resolveExemptAmount(rule, monthlyRent);
  const r = computeDepositInterest({
    deposit,
    monthsHeld: 24,
    annualRatePct: rate,
    minHoldingMonths: rule.minHoldingMonths,
    exemptAmount,
  });
  if (!r.eligible) {
    return `Example: a ${usd(deposit)} deposit held under ${state.name}'s ${rule.minHoldingMonths}-month threshold earns no interest yet — ${r.reason}`;
  }
  const exemptClause =
    exemptAmount > 0
      ? ` After excluding the ${usd(exemptAmount)} exempt amount, interest is computed on ${usd(r.interestBase)}.`
      : "";
  return `Example: a ${usd(deposit)} deposit held for 2 years at ${percent(
    rate,
  )} per year.${exemptClause} Simple interest owed ≈ ${usd(
    r.interest,
  )}, so the landlord returns about ${usd(r.totalDue)} in total. (Rates can change year to year — confirm the current figure.)`;
}

export const TOOL_META = {
  h1: "Security Deposit Interest Calculator",
  intro:
    "Find out exactly how much interest you owe a tenant on their security deposit. Pick your state for its specific rule, rate, and statute — then download a PDF interest statement. Free, no signup.",
};
