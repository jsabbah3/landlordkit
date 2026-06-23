/**
 * Verified state-data tables rendered inside guides (the "data study" backlink
 * assets). Built from the SAME data files the tools use — so a published table
 * can never drift from the live calculators, and no legal value is ever
 * hand-transcribed. Mirrors scripts/gtm-tables.mjs, but for on-page rendering.
 */
import { US_STATES } from "@/lib/states";
import { DEPOSIT_INTEREST } from "@/tools/security-deposit-interest/data";
import { LATE_FEE } from "@/tools/late-fee/data";
import { RENT_INCREASE } from "@/tools/rent-increase-notice/data";
import { DEPOSIT_RETURN } from "@/tools/security-deposit-return/data";

const NAME = new Map(US_STATES.map((s) => [s.code, s.name]));
const SLUG = new Map(US_STATES.map((s) => [s.code, s.slug]));

export type GuideTableId =
  | "deposit-interest"
  | "late-fee"
  | "rent-increase"
  | "deposit-return";

export interface GuideTableRow {
  stateName: string;
  stateSlug: string;
  /** Cells after the linked State column, in header order. */
  cells: string[];
}

export interface GuideTable {
  headers: string[]; // first header is always "State"
  toolSlug: string; // builds /tools/<toolSlug>/<stateSlug> for the State link
  rows: GuideTableRow[];
}

function depositInterestTable(): GuideTable {
  const rows: GuideTableRow[] = Object.entries(DEPOSIT_INTEREST).map(([code, r]) => {
    const rate =
      r.rateBasis === "fixed"
        ? `${r.defaultRatePct}%`
        : r.rateBasis === "published-annually"
          ? `Published annually (~${r.defaultRatePct}%)`
          : "Bank account rate";
    const hold = r.minHoldingMonths > 0 ? `${r.minHoldingMonths} months` : "None";
    return { stateName: NAME.get(code)!, stateSlug: SLUG.get(code)!, cells: [rate, hold, r.cite.statute] };
  });
  return { headers: ["State", "Rate", "Holding period", "Statute"], toolSlug: "security-deposit-interest-calculator", rows };
}

function lateFeeTable(): GuideTable {
  const rows: GuideTableRow[] = [];
  for (const [code, r] of Object.entries(LATE_FEE)) {
    if (r.capType === "reasonable" || r.capType === "none") continue;
    const cap =
      r.capType === "percent"
        ? `${r.capPercent}% of rent`
        : r.capType === "flat"
          ? `$${r.capFlat}`
          : `${r.combine === "lesser" ? "Lesser" : "Greater"} of $${r.capFlat} or ${r.capPercent}%`;
    const grace = r.graceDays > 0 ? `${r.graceDays} days` : "None set";
    rows.push({ stateName: NAME.get(code)!, stateSlug: SLUG.get(code)!, cells: [cap, grace, r.cite.statute] });
  }
  return { headers: ["State", "Max late fee", "Grace period", "Statute"], toolSlug: "late-fee-calculator", rows };
}

function rentIncreaseTable(): GuideTable {
  const rows: GuideTableRow[] = Object.entries(RENT_INCREASE).map(([code, r]) => {
    const extra = r.tiers?.length
      ? ` (up to ${Math.max(...r.tiers.map((t) => t.noticeDays))} in some cases)`
      : "";
    return {
      stateName: NAME.get(code)!,
      stateSlug: SLUG.get(code)!,
      cells: [`${r.baseNoticeDays} days${extra}`, r.rentControl === "none" ? "No" : r.rentControl, r.cite.statute],
    };
  });
  return { headers: ["State", "Minimum notice", "Rent control?", "Statute"], toolSlug: "rent-increase-notice-generator", rows };
}

function depositReturnTable(): GuideTable {
  const rows: GuideTableRow[] = Object.entries(DEPOSIT_RETURN).map(([code, r]) => ({
    stateName: NAME.get(code)!,
    stateSlug: SLUG.get(code)!,
    cells: [`${r.deadlineDays} days`, `${r.deadlineDaysIfDeducting ?? r.deadlineDays} days`, r.cite.statute],
  }));
  return { headers: ["State", "Return deadline", "If deducting", "Statute"], toolSlug: "security-deposit-return-tracker", rows };
}

const BUILDERS: Record<GuideTableId, () => GuideTable> = {
  "deposit-interest": depositInterestTable,
  "late-fee": lateFeeTable,
  "rent-increase": rentIncreaseTable,
  "deposit-return": depositReturnTable,
};

export const getGuideTable = (id: GuideTableId): GuideTable => BUILDERS[id]();
