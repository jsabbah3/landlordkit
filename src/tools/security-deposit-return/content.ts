import type { USState } from "@/lib/states";
import type { DepositReturnRule } from "./data";

export function buildSummary(state: USState, rule: DepositReturnRule): string {
  const base = `In ${state.name}, a landlord must return a tenant's security deposit within ${rule.deadlineDays} days of move-out`;
  const ded =
    rule.deadlineDaysIfDeducting != null && rule.deadlineDaysIfDeducting !== rule.deadlineDays
      ? ` (${rule.deadlineDaysIfDeducting} days if deductions are itemized)`
      : "";
  const item = rule.itemization
    ? ", along with an itemized list of any deductions"
    : "";
  const pen = rule.penalty ? ` ${rule.penalty}` : "";
  return `${base}${ded}${item}.${pen}`;
}

export function buildFaqs(
  state: USState,
  rule: DepositReturnRule,
): { q: string; a: string }[] {
  return [
    {
      q: `How long does a landlord have to return a security deposit in ${state.name}?`,
      a: `${buildSummary(state, rule)} (${rule.cite.statute}).`,
    },
    {
      q: `Does ${state.name} require an itemized list of deductions?`,
      a: rule.itemization
        ? `Yes. You must provide the tenant with an itemized statement of any amounts deducted from the deposit.`
        : `${state.name} does not strictly require itemization, but providing an itemized statement is best practice and protects you in a dispute.`,
    },
    {
      q: `What happens if the deposit isn't returned on time in ${state.name}?`,
      a: rule.penalty
        ? `${rule.penalty} Missing the deadline can also forfeit your right to keep any of the deposit.`
        : `Missing the deadline can forfeit your right to keep any of the deposit and expose you to damages — return it on time and keep proof of delivery.`,
    },
    {
      q: `Is this deposit return tool free?`,
      a: "Yes — free, no signup, and you can download an itemized statement PDF.",
    },
  ];
}

export const TOOL_META = {
  h1: "Security Deposit Return Tracker",
  intro:
    "See your state's deposit return deadline, itemize your deductions, and generate a clean itemized statement to send with the refund. Returning late — or without itemization — can cost you double or triple the deposit. Free, no signup.",
};
