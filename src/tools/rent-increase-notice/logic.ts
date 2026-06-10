import { parseISODate } from "@/lib/format";
import type { RentIncreaseRule } from "./data";

export interface NoticeInput {
  rule: RentIncreaseRule;
  currentRent: number;
  newRent: number;
  /** Months the tenant has occupied the unit (for tenancy-length tiers). */
  tenancyMonths?: number;
}

export interface NoticeResult {
  requiredNoticeDays: number;
  increaseAmount: number;
  increasePct: number;
  /** Notes from any tiers that pushed the notice period above the base. */
  governingNotes: string[];
}

/**
 * Determines the required written-notice period. The governing notice is the
 * MAXIMUM of the base period and every tier whose condition is met (e.g. a
 * large increase to a long-tenured tenant takes the longest applicable notice).
 */
export function computeRequiredNotice(input: NoticeInput): NoticeResult {
  const { rule } = input;
  const current = Math.max(0, input.currentRent || 0);
  const next = Math.max(0, input.newRent || 0);
  const increaseAmount = Math.round((next - current) * 100) / 100;
  const increasePct = current > 0 ? (increaseAmount / current) * 100 : 0;
  const tenancyMonths = Math.max(0, input.tenancyMonths ?? 0);

  let days = rule.baseNoticeDays;
  const governingNotes: string[] = [];

  for (const tier of rule.tiers ?? []) {
    const pctOk =
      tier.whenIncreasePctAtLeast == null ||
      increasePct >= tier.whenIncreasePctAtLeast;
    const tenancyOk =
      tier.whenTenancyMonthsAtLeast == null ||
      tenancyMonths >= tier.whenTenancyMonthsAtLeast;
    if (pctOk && tenancyOk && tier.noticeDays >= days) {
      days = tier.noticeDays;
      governingNotes.push(tier.note);
    }
  }

  return {
    requiredNoticeDays: days,
    increaseAmount,
    increasePct: Math.round(increasePct * 100) / 100,
    governingNotes,
  };
}

/** Earliest lawful effective date = today + required notice days. */
export function earliestEffectiveDate(
  noticeDays: number,
  fromISO?: string,
): Date {
  const from = (fromISO && parseISODate(fromISO)) || new Date();
  const d = new Date(from);
  d.setDate(d.getDate() + noticeDays);
  return d;
}
