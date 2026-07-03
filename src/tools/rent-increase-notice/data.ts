import type { LegalProvenance } from "@/lib/legal";

/* ============================================================================
 * RENT INCREASE NOTICE PERIODS — STATE DATA
 * ----------------------------------------------------------------------------
 * ⚠️  REVIEW BEFORE LAUNCH. Notice-period rules and rent-control caps change
 *     often. `confidence` is honest:
 *        high   = well-documented, stable rule (still spot-check).
 *        medium = standard rule but verify the exact statute/citation.
 *        low    = citation is a placeholder or the rule is in flux — VERIFY.
 *
 * MODEL
 *   baseNoticeDays  Minimum written notice for a month-to-month increase.
 *   tiers           Conditions that raise the required notice (e.g. CA: 90 days
 *                   when the increase is >=10%; NY: scales with tenancy length).
 *                   The governing notice is the MAX of base + matching tiers.
 *   rentControl     none | statewide | local — surfaced as a caution, not a cap
 *                   calculation (local caps vary by city).
 * ========================================================================== */

export type RentControl = "none" | "statewide" | "local";

export interface NoticeTier {
  whenIncreasePctAtLeast?: number;
  whenTenancyMonthsAtLeast?: number;
  noticeDays: number;
  note: string;
}

export interface RentIncreaseRule {
  baseNoticeDays: number;
  tiers?: NoticeTier[];
  rentControl: RentControl;
  controlNote?: string;
  /** Extra state-specific sentence appended to the generated summary. */
  notes?: string;
  cite: LegalProvenance;
}

const V = "2026-06-01";

// Helper to cut boilerplate for the many "30 days, standard" states.
const std = (
  statute: string,
  confidence: LegalProvenance["confidence"],
  extra?: Partial<RentIncreaseRule>,
): RentIncreaseRule => ({
  baseNoticeDays: 30,
  rentControl: "none",
  cite: { statute, lastVerified: V, confidence },
  ...extra,
});

export const RENT_INCREASE: Record<string, RentIncreaseRule> = {
  AL: std("Ala. Code § 35-9A-441", "low"),
  AK: std("Alaska Stat. § 34.03.290", "low"),
  AZ: std("Ariz. Rev. Stat. § 33-1375", "medium"),
  AR: std("Ark. Code § 18-17-704", "low"),
  CA: {
    baseNoticeDays: 30,
    tiers: [
      {
        whenIncreasePctAtLeast: 10,
        noticeDays: 90,
        note: "Increases of more than 10% within 12 months require 90 days' notice.",
      },
    ],
    rentControl: "statewide",
    controlNote:
      "AB 1482 caps annual increases at 5% + local CPI (max 10%) for most units more than 15 years old. Many cities (LA, SF, Oakland) have stricter local control.",
    cite: {
      statute: "Cal. Civ. Code § 827",
      statuteUrl:
        "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=827.",
      lastVerified: V,
      confidence: "high",
    },
  },
  CO: {
    baseNoticeDays: 60,
    rentControl: "none",
    notes:
      "C.R.S. § 38-12-701 requires at least 60 days' written notice to raise rent on a tenancy WITHOUT a written agreement, and bars terminating such a tenancy primarily to raise rent in a way inconsistent with the section. With a written lease, increases generally take effect at renewal per the lease terms.",
    cite: {
      statute: "Colo. Rev. Stat. § 38-12-701",
      statuteUrl: "https://colorado.public.law/statutes/crs_38-12-701",
      lastVerified: "2026-07-02",
      confidence: "high",
    },
  },
  CT: std("Conn. Gen. Stat. § 47a-23", "low"),
  DE: {
    baseNoticeDays: 60,
    rentControl: "none",
    cite: { statute: "25 Del. C. § 5107", lastVerified: V, confidence: "medium" },
  },
  DC: {
    baseNoticeDays: 30,
    rentControl: "local",
    controlNote:
      "Much of DC's housing is rent-controlled; controlled units have separate annual adjustment limits and longer notice.",
    cite: { statute: "D.C. Code § 42-3509.04", lastVerified: V, confidence: "low" },
  },
  FL: std("Fla. Stat. § 83.57", "medium", {
    notes:
      "Florida has no statute setting a specific rent-increase notice period for month-to-month tenancies beyond the 15-day termination rule; 30 days is common practice. Some counties have added notice rules.",
  }),
  GA: std("Ga. Code § 44-7-7", "low"),
  HI: {
    baseNoticeDays: 45,
    rentControl: "none",
    cite: { statute: "Haw. Rev. Stat. § 521-21", lastVerified: V, confidence: "low" },
  },
  ID: std("Idaho Code § 55-307", "low"),
  IL: std("765 ILCS 705", "low", {
    rentControl: "local",
    controlNote: "Statewide rent control is preempted; Chicago has notice ordinances.",
  }),
  IN: std("Ind. Code § 32-31-5-4", "low"),
  IA: {
    baseNoticeDays: 30,
    rentControl: "none",
    cite: { statute: "Iowa Code § 562A.13", lastVerified: V, confidence: "low" },
  },
  KS: std("Kan. Stat. § 58-2570", "low"),
  KY: std("Ky. Rev. Stat. § 383.695", "low"),
  LA: std("La. Civ. Code art. 2728", "low"),
  ME: {
    baseNoticeDays: 45,
    rentControl: "local",
    controlNote: "Portland and a few municipalities have local rent control.",
    cite: { statute: "14 M.R.S. § 6015", lastVerified: V, confidence: "medium" },
  },
  MD: std("Md. Code, Real Prop. § 8-208", "low", {
    notes: "Some Maryland counties (e.g. Montgomery, Prince George's) have rent stabilization.",
    rentControl: "local",
  }),
  MA: std("Mass. Gen. Laws ch. 186, § 12", "medium"),
  MI: std("Mich. Comp. Laws § 554.134", "low"),
  MN: std("Minn. Stat. § 504B.135", "medium"),
  MS: std("Miss. Code § 89-8-19", "low"),
  MO: std("Mo. Rev. Stat. § 441.060", "low"),
  MT: std("Mont. Code § 70-24-311", "low"),
  NE: std("Neb. Rev. Stat. § 76-1437", "low"),
  NV: {
    baseNoticeDays: 60,
    rentControl: "none",
    notes: "Nevada requires 60 days for month-to-month and 45 days for periodic tenancies under 1 month — verify which applies.",
    cite: { statute: "Nev. Rev. Stat. § 118A.300", lastVerified: V, confidence: "medium" },
  },
  NH: std("N.H. Rev. Stat. § 540:2", "low"),
  NJ: std("N.J. Stat. § 2A:18-61.1", "medium", {
    rentControl: "local",
    controlNote: "Over 100 NJ municipalities have local rent control with their own caps and notice rules.",
  }),
  NM: std("N.M. Stat. § 47-8-15", "low"),
  NY: {
    baseNoticeDays: 30,
    tiers: [
      {
        whenTenancyMonthsAtLeast: 12,
        noticeDays: 60,
        note: "Tenants housed 1–2 years (or with a 1-year+ lease) get 60 days' notice.",
      },
      {
        whenTenancyMonthsAtLeast: 24,
        noticeDays: 90,
        note: "Tenants housed more than 2 years get 90 days' notice.",
      },
    ],
    rentControl: "local",
    controlNote:
      "NYC and many localities have rent stabilization with separate increase limits set by Rent Guidelines Boards.",
    cite: {
      statute: "N.Y. Real Prop. Law § 226-c",
      statuteUrl: "https://www.nysenate.gov/legislation/laws/RPP/226-C",
      lastVerified: V,
      confidence: "high",
    },
  },
  NC: std("N.C. Gen. Stat. § 42-14", "low"),
  ND: {
    baseNoticeDays: 30,
    rentControl: "none",
    cite: { statute: "N.D. Cent. Code § 47-16-15", lastVerified: V, confidence: "low" },
  },
  OH: std("Ohio Rev. Code § 5321.17", "low"),
  OK: std("Okla. Stat. tit. 41 § 111", "low"),
  OR: {
    baseNoticeDays: 90,
    rentControl: "statewide",
    controlNote:
      "Oregon caps annual increases (SB 608) at 7% + CPI, capped at 10%. No increase is allowed during the first year of a tenancy; buildings under 15 years old are exempt.",
    cite: {
      statute: "Or. Rev. Stat. §§ 90.323 / 90.600",
      statuteUrl: "https://oregon.public.law/statutes/ors_90.600",
      lastVerified: V,
      confidence: "medium",
    },
  },
  PA: std("68 Pa. Stat. § 250.501", "low"),
  RI: std("R.I. Gen. Laws § 34-18-16.1", "medium", {
    notes: "Rhode Island requires 30 days, or 60 days if the tenant is 62 or older.",
  }),
  SC: std("S.C. Code § 27-40-770", "low"),
  SD: std("S.D. Codified Laws § 43-32-13", "low"),
  TN: std("Tenn. Code § 66-28-512", "low"),
  TX: std("No specific Texas statute (governed by the lease/rental period)", "medium", {
    notes:
      "Texas has no statute mandating advance notice of a rent increase; for month-to-month, give notice at least one rental period (commonly 30 days) ahead, or as the lease requires.",
  }),
  UT: std("Utah Code § 78B-6-802", "low"),
  VT: {
    baseNoticeDays: 60,
    rentControl: "local",
    controlNote: "Burlington has local provisions.",
    cite: { statute: "9 V.S.A. § 4455", lastVerified: V, confidence: "medium" },
  },
  VA: std("Va. Code § 55.1-1253", "low"),
  WA: {
    baseNoticeDays: 90,
    rentControl: "statewide",
    controlNote:
      "Washington's rent-stabilization law (HB 1217, effective May 7, 2025) requires at least 90 days' written notice for ANY rent increase and caps most annual increases at 7% + CPI (10% max). Specific notice forms are required, and cap exemptions (e.g. newer buildings) must be claimed in the notice — see the WA Dept. of Commerce HB 1217 landlord resource center.",
    cite: {
      statute: "Rev. Code Wash. § 59.18.140(3) (as amended by HB 1217, 2025)",
      statuteUrl: "https://app.leg.wa.gov/rcw/default.aspx?cite=59.18.140",
      lastVerified: "2026-07-02",
      confidence: "high",
    },
  },
  WV: std("W. Va. Code § 37-6-5", "low"),
  WI: std("Wis. Stat. § 704.19", "low"),
  WY: std("Wyo. Stat. § 1-21-1203", "low"),
};

export const getRentIncreaseRule = (code: string): RentIncreaseRule | undefined =>
  RENT_INCREASE[code];

export const rentIncreaseStateCodes = (): string[] => Object.keys(RENT_INCREASE);
