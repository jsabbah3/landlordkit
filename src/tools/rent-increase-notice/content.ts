import type { USState } from "@/lib/states";
import type { RentIncreaseRule } from "./data";

const controlSentence: Record<RentIncreaseRule["rentControl"], string> = {
  none: "There is no statewide rent-control cap on how much you can raise the rent.",
  statewide: "A statewide cap limits how much you can raise the rent.",
  local: "Some cities have local rent control with their own caps and notice rules.",
};

export function buildSummary(state: USState, rule: RentIncreaseRule): string {
  const parts = [
    `In ${state.name}, a landlord must generally give at least ${rule.baseNoticeDays} days' written notice before raising rent on a month-to-month tenancy.`,
  ];
  if (rule.tiers?.length) {
    parts.push(rule.tiers.map((t) => t.note).join(" "));
  }
  parts.push(controlSentence[rule.rentControl]);
  if (rule.controlNote) parts.push(rule.controlNote);
  if (rule.notes) parts.push(rule.notes);
  return parts.join(" ");
}

export function buildFaqs(
  state: USState,
  rule: RentIncreaseRule,
): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [
    {
      q: `How much notice must a landlord give before raising rent in ${state.name}?`,
      a: `At least ${rule.baseNoticeDays} days' written notice for a month-to-month tenancy${
        rule.tiers?.length ? ", and more in some cases" : ""
      }. ${rule.tiers?.map((t) => t.note).join(" ") ?? ""} (${rule.cite.statute}).`,
    },
    {
      q: `Can a landlord raise rent during a fixed-term lease in ${state.name}?`,
      a: `Generally no — rent is locked for the fixed term unless the lease itself allows an increase. A rent increase typically takes effect when the lease renews or during a month-to-month tenancy.`,
    },
    {
      q: `Is there a limit on how much rent can be raised in ${state.name}?`,
      a:
        rule.rentControl === "none"
          ? `${state.name} has no statewide rent-control cap, so there is no fixed percentage limit — but local ordinances or the lease may impose one.`
          : `Yes. ${rule.controlNote ?? "A rent-control cap applies — check the current limit."}`,
    },
    {
      q: `Does this rent increase notice generator cost anything?`,
      a: "No. It's free and requires no signup. You enter the details and download a ready-to-send PDF letter.",
    },
  ];
  return faqs;
}

export function buildExample(state: USState, rule: RentIncreaseRule): string {
  const big = rule.tiers?.some((t) => (t.whenIncreasePctAtLeast ?? 0) > 0);
  if (big) {
    return `Example: raising rent from $2,000 to $2,300 (a 15% increase) in ${state.name} would require the longer notice period because the increase exceeds the tier threshold — plan the effective date accordingly.`;
  }
  return `Example: to raise a ${state.name} tenant's rent from $1,500 to $1,600, send written notice at least ${rule.baseNoticeDays} days before the new rent takes effect, and keep proof of delivery.`;
}

export const TOOL_META = {
  h1: "Rent Increase Notice Generator",
  intro:
    "Create a professional, compliant rent increase letter in seconds. We apply your state's required notice period and flag any rent-control caveats — then you download a clean PDF to send your tenant. Free, no signup.",
};
