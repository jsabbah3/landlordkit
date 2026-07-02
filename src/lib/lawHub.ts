/**
 * State law hub pages (/laws/[state]) — presentation layer over the unified
 * legal DB. INTEGRITY RULES:
 *   1. Only `high`/`medium` confidence fields render a value. Everything else
 *      is listed as "not yet verified" — we never display a guessed value.
 *   2. A state only gets a hub page once it has enough verified substance
 *      (MIN_VERIFIED_FIELDS) — no thin pages. Research unlocks more states.
 */
import { US_STATES, type USState } from "@/lib/states";
import {
  allStateLegal,
  getStateLegal,
  fieldEntries,
  type Field,
  type StateLegal,
} from "@/lib/legal-db";

export const MIN_VERIFIED_FIELDS = 4;

const isShown = (f: Field<unknown>): boolean =>
  (f.confidence === "high" || f.confidence === "medium") && f.value != null;

export function verifiedFieldCount(rec: StateLegal): number {
  return fieldEntries(rec).filter(isShown).length;
}

/** States that currently qualify for a hub page. */
export function hubStates(): USState[] {
  const byCode = new Map(US_STATES.map((s) => [s.code, s]));
  return allStateLegal()
    .filter((r) => verifiedFieldCount(r) >= MIN_VERIFIED_FIELDS)
    .map((r) => byCode.get(r.state)!)
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** States not yet published, for the honest "in verification" index list. */
export function pendingStates(): USState[] {
  const live = new Set(hubStates().map((s) => s.code));
  return US_STATES.filter((s) => !live.has(s.code));
}

export interface HubRow {
  label: string;
  /** Question form, used for FAQ schema. */
  question: string;
  value: string; // formatted display value
  field: Field<unknown>;
  toolSlug?: string; // deep link to the matching tool's state page
}

export interface HubSection {
  title: string;
  rows: HubRow[];
}

const days = (v: unknown) => `${v} day${v === 1 ? "" : "s"}`;
const yesNo = (v: unknown) => (v ? "Yes" : "No");
const str = (v: unknown) => String(v);

/** Everything we can render for a state, split into shown sections and the
 *  not-yet-verified list. */
export function buildHub(code: string): {
  state: StateLegal;
  sections: HubSection[];
  unverified: string[];
} | null {
  const rec = getStateLegal(code);
  if (!rec) return null;
  const n = rec.name;

  type Spec = [string, string, Field<unknown>, (v: unknown) => string, string?];
  const specs: { title: string; fields: Spec[] }[] = [
    {
      title: "Security deposits",
      fields: [
        ["Maximum deposit", `How much can a landlord charge for a security deposit in ${n}?`, rec.securityDeposit.maxLimit, str, "security-deposit-interest-calculator"],
        ["Return deadline", `How long does a landlord have to return a security deposit in ${n}?`, rec.securityDeposit.returnDeadlineDays, days, "security-deposit-return-tracker"],
        ["Deadline when deducting", `What is the deposit return deadline with deductions in ${n}?`, rec.securityDeposit.returnDeadlineIfDeductingDays, days, "security-deposit-return-tracker"],
        ["Itemized statement required", `Does ${n} require an itemized statement for deposit deductions?`, rec.securityDeposit.itemizationRequired, yesNo, "security-deposit-return-tracker"],
        ["Interest on the deposit", `Do landlords owe interest on security deposits in ${n}?`, rec.securityDeposit.interestRequired, yesNo, "security-deposit-interest-calculator"],
        ["Interest rule", `How is security deposit interest calculated in ${n}?`, rec.securityDeposit.interestSummary, str, "security-deposit-interest-calculator"],
      ],
    },
    {
      title: "Rent, fees, and notice",
      fields: [
        ["Late fee limit", `What is the maximum late fee a landlord can charge in ${n}?`, rec.lateFee.capSummary, str, "late-fee-calculator"],
        ["Late fee grace period", `How many days late can rent be before a fee in ${n}?`, rec.lateFee.graceDays, days, "late-fee-calculator"],
        ["Rent increase notice", `How much notice is required to raise rent in ${n}?`, rec.notice.rentIncreaseDays, days, "rent-increase-notice-generator"],
        ["Month-to-month termination notice", `How much notice ends a month-to-month tenancy in ${n}?`, rec.notice.terminationDays, days],
        ["Entry notice", `How much notice must a landlord give before entering in ${n}?`, rec.notice.entryHours, (v) => `${v} hours`],
      ],
    },
  ];

  const sections: HubSection[] = [];
  const unverified: string[] = [];
  for (const s of specs) {
    const rows: HubRow[] = [];
    for (const [label, question, field, fmt, toolSlug] of s.fields) {
      if (isShown(field)) rows.push({ label, question, value: fmt(field.value), field, toolSlug });
      else unverified.push(label);
    }
    if (rows.length) sections.push({ title: s.title, rows });
  }
  // Whole-category unverified items (never shown as values anywhere yet).
  for (const [label, f] of [
    ["Required disclosures", rec.disclosures],
    ["Habitability standards", rec.habitability],
    ["Rent receipt rules", rec.rentReceipt],
  ] as const) {
    if (!isShown(f)) unverified.push(label);
  }

  return { state: rec, sections, unverified };
}
