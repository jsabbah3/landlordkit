/**
 * Unified landlord-tenant legal database — the single consumable source of
 * truth, generated at /data/legal/ by `npm run build:legal` (which reads the
 * canonical per-topic datasets in src/tools/<topic>/data.ts).
 *
 * INTEGRITY RULE: a field is only `high`/`medium` confidence if its value was
 * verified against the cited statute. Everything else is `unverified` with a
 * null value — we never invent a legal value. See LEGAL-REVIEW.md for the
 * checklist of what still needs human verification.
 */
import db from "../../data/legal/db.json";

export type Confidence = "high" | "medium" | "low" | "unverified";

/** A single legal data point with full provenance. */
export interface Field<T> {
  value: T | null;
  statute: string | null;
  statuteUrl: string | null;
  /** ISO date the value was last checked against the source(s). */
  lastVerified: string | null;
  confidence: Confidence;
  /** Names/URLs of the sources cross-checked (>=2 expected for `high`). */
  sources: string[];
  notes?: string;
}

export interface StateLegal {
  state: string; // USPS code
  name: string;
  securityDeposit: {
    maxLimit: Field<string>; // e.g. "1.5 months' rent" or "No statutory limit"
    returnDeadlineDays: Field<number>;
    returnDeadlineIfDeductingDays: Field<number>;
    itemizationRequired: Field<boolean>;
    interestRequired: Field<boolean>;
    interestSummary: Field<string>;
  };
  notice: {
    entryHours: Field<number>; // landlord entry notice
    rentIncreaseDays: Field<number>;
    terminationDays: Field<number>; // month-to-month termination
  };
  lateFee: {
    capSummary: Field<string>;
    graceDays: Field<number>;
  };
  disclosures: Field<string[]>;
  habitability: Field<string>;
  rentReceipt: Field<string>;
  /** Most recent verification date across all fields, or null. */
  lastVerified: string | null;
}

const DB = db as unknown as Record<string, StateLegal>;

export const getStateLegal = (code: string): StateLegal | undefined =>
  DB[code?.toUpperCase()];

export const allStateLegal = (): StateLegal[] => Object.values(DB);

/** Coverage = share of fields at `high`/`medium` confidence, for dashboards. */
export function fieldEntries(rec: StateLegal): Field<unknown>[] {
  const { securityDeposit: d, notice: n, lateFee: l } = rec;
  return [
    d.maxLimit, d.returnDeadlineDays, d.returnDeadlineIfDeductingDays,
    d.itemizationRequired, d.interestRequired, d.interestSummary,
    n.entryHours, n.rentIncreaseDays, n.terminationDays,
    l.capSummary, l.graceDays,
    rec.disclosures, rec.habitability, rec.rentReceipt,
  ];
}
