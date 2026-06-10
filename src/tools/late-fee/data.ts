import type { LegalProvenance } from "@/lib/legal";

/* ============================================================================
 * RENT LATE FEE CAPS & GRACE PERIODS — STATE DATA
 * ----------------------------------------------------------------------------
 * ⚠️  REVIEW BEFORE LAUNCH. Late-fee caps and grace periods vary and change.
 *     `confidence`: high = well-documented; medium = verify statute; low =
 *     placeholder/uncertain — VERIFY.
 *
 * MODEL
 *   graceDays   Days after the due date before a late fee may be charged.
 *   capType     percent | flat | percent_or_flat | reasonable | none
 *               - reasonable/none => no fixed statutory cap (fee must just be a
 *                 reasonable estimate of damages; the calculator returns no max).
 *   capPercent  % of monthly rent (when capType uses percent).
 *   capFlat     Dollar cap (when capType uses flat).
 *   combine     For percent_or_flat: take the 'lesser' or 'greater' of the two.
 * ========================================================================== */

export type LateFeeCapType =
  | "percent"
  | "flat"
  | "percent_or_flat"
  | "reasonable"
  | "none";

export interface LateFeeRule {
  graceDays: number;
  capType: LateFeeCapType;
  capPercent?: number;
  capFlat?: number;
  combine?: "lesser" | "greater";
  notes?: string;
  cite: LegalProvenance;
}

const V = "2026-06-01";

// Default: many states have no statutory cap — the fee must just be "reasonable".
const reasonable = (
  statute: string,
  confidence: LegalProvenance["confidence"],
  extra?: Partial<LateFeeRule>,
): LateFeeRule => ({
  graceDays: 0,
  capType: "reasonable",
  cite: { statute, lastVerified: V, confidence },
  ...extra,
});

export const LATE_FEE: Record<string, LateFeeRule> = {
  AL: reasonable("Ala. Code § 35-9A-161", "low"),
  AK: reasonable("Alaska Stat. § 34.03", "low"),
  AZ: reasonable("Ariz. Rev. Stat. § 33-1368", "low", {
    notes: "Arizona requires the late fee to be reasonable and stated in the lease; no fixed percentage cap.",
  }),
  AR: reasonable("Ark. Code § 18-17-701", "low"),
  CA: reasonable("Cal. Civ. Code § 1671", "medium", {
    notes: "California has no statutory percentage cap, but a late fee must be a reasonable pre-estimate of the landlord's actual damages. Courts often treat fees above ~5–6% of rent as suspect.",
  }),
  CO: {
    graceDays: 7,
    capType: "percent_or_flat",
    capPercent: 5,
    capFlat: 50,
    combine: "greater",
    notes: "Colorado (2021): late fee capped at the greater of $50 or 5% of past-due rent, after a 7-day grace period.",
    cite: { statute: "Colo. Rev. Stat. § 38-12-105", lastVerified: V, confidence: "medium" },
  },
  CT: {
    graceDays: 9,
    capType: "reasonable",
    notes: "Connecticut allows a late fee only after a 9-day grace period; the fee must be reasonable.",
    cite: { statute: "Conn. Gen. Stat. § 47a-15a / § 47a-4(a)", lastVerified: V, confidence: "low" },
  },
  DE: {
    graceDays: 5,
    capType: "percent",
    capPercent: 5,
    notes: "Delaware: 5% of the monthly rent, chargeable after a 5-day grace period (longer if the landlord has no in-county rental office).",
    cite: { statute: "25 Del. C. § 5501(d)", lastVerified: V, confidence: "medium" },
  },
  DC: reasonable("D.C. Code § 42-3505.31", "low", {
    graceDays: 5,
    capType: "percent",
    capPercent: 5,
    notes: "DC caps late fees at 5% of monthly rent with a 5-day grace period.",
  }),
  FL: reasonable("Fla. Stat. § 83.808", "low", {
    notes: "Florida has no statutory cap; the late fee must be in the lease and reasonable.",
  }),
  GA: reasonable("Ga. Code § 44-7", "low"),
  HI: { graceDays: 0, capType: "percent", capPercent: 8, notes: "Hawaii caps late fees at 8% of the rent due.", cite: { statute: "Haw. Rev. Stat. § 521-21(f)", lastVerified: V, confidence: "medium" } },
  ID: reasonable("Idaho Code § 6-303", "low"),
  IL: reasonable("765 ILCS 705", "low", {
    notes: "No statewide cap. Chicago's RLTO caps late fees at $10/month on the first $500 of rent plus 5% of any amount above $500.",
  }),
  IN: reasonable("Ind. Code § 32-31", "low"),
  IA: {
    graceDays: 0,
    capType: "reasonable",
    notes: "Iowa sets per-day caps tied to rent: if rent is $700 or less, up to $12/day (max $40/month); if over $700, up to $20/day (max $100/month). Use those limits — this calculator shows no fixed percentage.",
    cite: { statute: "Iowa Code § 562A.9(4)", lastVerified: V, confidence: "medium" },
  },
  KS: reasonable("Kan. Stat. § 58-2545", "low"),
  KY: reasonable("Ky. Rev. Stat. § 383", "low"),
  LA: reasonable("La. Civ. Code", "low"),
  ME: {
    graceDays: 15,
    capType: "percent",
    capPercent: 4,
    notes: "Maine caps late fees at 4% of the monthly rent and requires a 15-day grace period — the strictest in the country.",
    cite: { statute: "14 M.R.S. § 6028", lastVerified: V, confidence: "high" },
  },
  MD: { graceDays: 0, capType: "percent", capPercent: 5, notes: "Maryland caps late fees at 5% of the monthly rent.", cite: { statute: "Md. Code, Real Prop. § 8-208(d)(3)", lastVerified: V, confidence: "medium" } },
  MA: {
    graceDays: 30,
    capType: "reasonable",
    notes: "Massachusetts prohibits charging a late fee until the rent is 30 days late.",
    cite: { statute: "Mass. Gen. Laws ch. 186, § 15B(1)(c)", lastVerified: V, confidence: "medium" },
  },
  MI: reasonable("Mich. Comp. Laws § 554", "low"),
  MN: reasonable("Minn. Stat. § 504B.177", "medium", {
    capType: "percent",
    capPercent: 8,
    notes: "Minnesota caps late fees at 8% of the overdue rent.",
  }),
  MS: reasonable("Miss. Code § 89-8", "low"),
  MO: reasonable("Mo. Rev. Stat. § 535", "low"),
  MT: reasonable("Mont. Code § 70-24", "low"),
  NE: reasonable("Neb. Rev. Stat. § 76-1414", "low"),
  NV: {
    graceDays: 0,
    capType: "percent",
    capPercent: 5,
    notes: "Nevada caps late fees at 5% of the periodic rent.",
    cite: { statute: "Nev. Rev. Stat. § 118A.210", lastVerified: V, confidence: "medium" },
  },
  NH: reasonable("N.H. Rev. Stat. § 540", "low"),
  NJ: reasonable("N.J. Stat. § 2A:42-6.1", "low", {
    graceDays: 5,
    notes: "New Jersey requires a 5-business-day grace period for senior and lower-income tenants; no fixed percentage cap.",
  }),
  NM: { graceDays: 0, capType: "percent", capPercent: 10, notes: "New Mexico caps late fees at 10% of the rent for the period.", cite: { statute: "N.M. Stat. § 47-8-15(D)", lastVerified: V, confidence: "medium" } },
  NY: {
    graceDays: 5,
    capType: "percent_or_flat",
    capPercent: 5,
    capFlat: 50,
    combine: "lesser",
    notes: "New York caps late fees at the lesser of $50 or 5% of the monthly rent, after a 5-day grace period.",
    cite: { statute: "N.Y. Real Prop. Law § 238-a", lastVerified: V, confidence: "high" },
  },
  NC: {
    graceDays: 5,
    capType: "percent_or_flat",
    capPercent: 5,
    capFlat: 15,
    combine: "greater",
    notes: "North Carolina caps the late fee at the greater of $15 or 5% of the monthly rent, after a 5-day grace period.",
    cite: { statute: "N.C. Gen. Stat. § 42-46", lastVerified: V, confidence: "medium" },
  },
  ND: reasonable("N.D. Cent. Code § 47-16", "low"),
  OH: reasonable("Ohio Rev. Code § 5321", "low"),
  OK: reasonable("Okla. Stat. tit. 41", "low"),
  OR: {
    graceDays: 4,
    capType: "reasonable",
    notes: "Oregon allows a late fee only after a 4-day grace period; it must be a reasonable flat fee or a reasonable daily/percentage charge.",
    cite: { statute: "Or. Rev. Stat. § 90.260", lastVerified: V, confidence: "medium" },
  },
  PA: reasonable("68 Pa. Stat.", "low"),
  RI: reasonable("R.I. Gen. Laws § 34-18", "low"),
  SC: reasonable("S.C. Code § 27-40", "low"),
  SD: reasonable("S.D. Codified Laws § 43-32", "low"),
  TN: {
    graceDays: 5,
    capType: "percent",
    capPercent: 10,
    notes: "Tennessee caps late fees at 10% of the past-due rent, after a 5-day grace period.",
    cite: { statute: "Tenn. Code § 66-28-201(d)", lastVerified: V, confidence: "medium" },
  },
  TX: {
    graceDays: 2,
    capType: "reasonable",
    notes: "Texas allows a late fee after a 2-day grace period; it is presumed reasonable if it does not exceed 12% of rent (units in buildings of 4 or fewer) or 10% (larger buildings).",
    cite: { statute: "Tex. Prop. Code § 92.019", lastVerified: V, confidence: "medium" },
  },
  UT: reasonable("Utah Code § 57-22", "low"),
  VT: reasonable("9 V.S.A. § 4455", "low"),
  VA: reasonable("Va. Code § 55.1-1204", "low", {
    notes: "Virginia caps late fees at the lesser of 10% of the rent or 10% of the remaining balance owed.",
    capType: "percent",
    capPercent: 10,
  }),
  WA: reasonable("Rev. Code Wash. § 59.18", "low"),
  WV: reasonable("W. Va. Code § 37-6", "low"),
  WI: reasonable("Wis. Stat. § 704", "low", {
    notes: "Wisconsin requires the late fee to be specified in the lease; no fixed cap.",
  }),
  WY: reasonable("Wyo. Stat. § 1-21", "low"),
};

export const getLateFeeRule = (code: string): LateFeeRule | undefined =>
  LATE_FEE[code];
export const lateFeeStateCodes = (): string[] => Object.keys(LATE_FEE);
