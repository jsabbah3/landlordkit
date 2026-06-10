import type { LegalProvenance } from "@/lib/legal";

/* ============================================================================
 * SECURITY DEPOSIT INTEREST — STATE DATA
 * ----------------------------------------------------------------------------
 * ⚠️  REVIEW BEFORE LAUNCH. This file was compiled from public legal summaries
 *     and statute references, NOT from a line-by-line read of every primary
 *     statute. Treat `confidence` honestly:
 *        high   = widely-settled, well-documented value (still spot-check).
 *        medium = from reputable secondary sources; verify the statute.
 *        low    = nuanced / uncertain; MUST verify before relying.
 *
 * This is the ONE file to edit when a rate or rule changes. Each entry carries
 * its own citation + lastVerified date so updates are auditable.
 *
 * IMPORTANT NUANCES we model (and competitors usually ignore):
 *   - minHoldingMonths: interest only accrues after a holding period (MA = 12,
 *     OH = 6, etc.).
 *   - exempt: interest is computed only on the deposit ABOVE a threshold
 *     (OH excludes the greater of $50 or one month's rent).
 *   - rateBasis: many states tie the rate to a bank/passbook rate or a value
 *     the state publishes ANNUALLY — for those we prefill a typical rate but
 *     let the user override, and we flag it clearly.
 * ========================================================================== */

export type RequiredStatus = "yes" | "no" | "local";
export type RateBasis = "fixed" | "published-annually" | "bank-passbook" | "none";

export interface DepositInterestRule {
  required: RequiredStatus;
  /** Annual % to prefill the calculator. Omitted when there is no set rate. */
  defaultRatePct?: number;
  rateBasis: RateBasis;
  /** Interest only accrues once the deposit has been held this many months. */
  minHoldingMonths: number;
  /** Interest is computed only on the deposit amount above this threshold. */
  exempt?: { fixed: number; orOneMonthRent: boolean };
  /** Scope limitation, e.g. only buildings of a certain size. */
  appliesTo?: string;
  /** When the interest must be paid to the tenant. */
  payTiming: string;
  /** One-sentence plain-English summary of the rule. */
  summary: string;
  cite: LegalProvenance;
}

const VERIFIED = "2026-06-01";

/**
 * States with a statewide interest rule (or a notable local one). States NOT
 * listed here fall back to NO_REQUIREMENT and do not get a dedicated SEO page.
 */
export const DEPOSIT_INTEREST: Record<string, DepositInterestRule> = {
  MA: {
    required: "yes",
    defaultRatePct: 5,
    rateBasis: "fixed",
    minHoldingMonths: 12,
    payTiming: "At the end of each year of tenancy, and within 30 days of move-out.",
    summary:
      "Landlords must pay 5% per year (or the actual rate received from the bank, if lower) on deposits held for at least one year.",
    cite: {
      statute: "Mass. Gen. Laws ch. 186, § 15B",
      statuteUrl:
        "https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15b",
      lastVerified: VERIFIED,
      confidence: "high",
    },
  },
  OH: {
    required: "yes",
    defaultRatePct: 5,
    rateBasis: "fixed",
    minHoldingMonths: 6,
    exempt: { fixed: 50, orOneMonthRent: true },
    payTiming: "Annually; interest accrues only on the qualifying excess amount.",
    summary:
      "Deposits over $50 or one month's rent (whichever is greater) earn 5% per year once the tenant has occupied the unit for six months.",
    cite: {
      statute: "Ohio Rev. Code § 5321.16",
      statuteUrl: "https://codes.ohio.gov/ohio-revised-code/section-5321.16",
      lastVerified: VERIFIED,
      confidence: "medium",
    },
  },
  MN: {
    required: "yes",
    defaultRatePct: 1,
    rateBasis: "fixed",
    minHoldingMonths: 0,
    payTiming: "When the deposit is returned, as simple non-compounded interest.",
    summary:
      "Landlords must pay simple, non-compounded interest (currently 1% per year) on the full deposit.",
    cite: {
      statute: "Minn. Stat. § 504B.178",
      statuteUrl: "https://www.revisor.mn.gov/statutes/cite/504B.178",
      lastVerified: VERIFIED,
      confidence: "medium",
    },
  },
  CT: {
    required: "yes",
    defaultRatePct: 0.1,
    rateBasis: "published-annually",
    minHoldingMonths: 0,
    payTiming: "Annually on the tenant's anniversary date, and at move-out.",
    summary:
      "Interest is paid at the deposit-index rate the CT Banking Commissioner sets each January (a low single-digit or fractional rate); confirm the current year's rate.",
    cite: {
      statute: "Conn. Gen. Stat. § 47a-21",
      statuteUrl: "https://www.cga.ct.gov/current/pub/chap_830.htm",
      lastVerified: VERIFIED,
      confidence: "medium",
    },
  },
  IL: {
    required: "yes",
    defaultRatePct: 0.01,
    rateBasis: "published-annually",
    minHoldingMonths: 6,
    appliesTo: "Buildings with 25 or more units.",
    payTiming: "Annually, within 30 days of the end of each 12-month period.",
    summary:
      "In buildings of 25+ units, deposits held over six months earn interest at the rate published by the state (tied to a major bank's minimum passbook rate).",
    cite: {
      statute: "765 ILCS 715 (Security Deposit Interest Act)",
      statuteUrl: "https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=2200",
      lastVerified: VERIFIED,
      confidence: "medium",
    },
  },
  MD: {
    required: "yes",
    defaultRatePct: 1.5,
    rateBasis: "published-annually",
    minHoldingMonths: 6,
    payTiming: "At deposit return; simple interest accrues at 6-month intervals.",
    summary:
      "Deposits earn simple interest at the greater of 1.5% per year or the U.S. Treasury 1-year yield (set each January), accruing in 6-month increments.",
    cite: {
      statute: "Md. Code, Real Property § 8-203",
      statuteUrl:
        "https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=grp&section=8-203",
      lastVerified: VERIFIED,
      confidence: "medium",
    },
  },
  NJ: {
    required: "yes",
    defaultRatePct: 0.1,
    rateBasis: "bank-passbook",
    minHoldingMonths: 0,
    payTiming: "Annually, either paid or credited toward rent.",
    summary:
      "Deposits must be held in an interest-bearing account; the tenant receives the interest earned (money-market rate for landlords with 10+ units, otherwise the bank's rate).",
    cite: {
      statute: "N.J. Stat. § 46:8-19",
      statuteUrl: "https://law.justia.com/codes/new-jersey/title-46/section-46-8-19/",
      lastVerified: VERIFIED,
      confidence: "medium",
    },
  },
  NY: {
    required: "yes",
    defaultRatePct: 0.1,
    rateBasis: "bank-passbook",
    minHoldingMonths: 0,
    appliesTo: "Buildings with six or more units.",
    payTiming: "Annually; landlord may retain a 1% administrative fee.",
    summary:
      "In buildings of 6+ units, deposits must be placed in an interest-bearing account; the tenant gets the interest minus a 1% annual administrative fee the landlord may keep.",
    cite: {
      statute: "N.Y. Gen. Oblig. Law § 7-103",
      statuteUrl: "https://www.nysenate.gov/legislation/laws/GOB/7-103",
      lastVerified: VERIFIED,
      confidence: "medium",
    },
  },
  PA: {
    required: "yes",
    defaultRatePct: 0.1,
    rateBasis: "bank-passbook",
    minHoldingMonths: 24,
    exempt: { fixed: 100, orOneMonthRent: false },
    payTiming: "Annually after the second year; landlord may keep a 1% fee.",
    summary:
      "For deposits over $100 held more than two years, the tenant earns the bank's interest rate (minus a 1% fee the landlord may retain).",
    cite: {
      statute: "68 Pa. Stat. § 250.511b",
      statuteUrl: "https://www.legis.state.pa.us/cfdocs/legis/LI/uconsCheck.cfm?txtType=HTM&yr=1951&sessInd=0&smthLwInd=0&act=20",
      lastVerified: VERIFIED,
      confidence: "medium",
    },
  },
  NM: {
    required: "yes",
    defaultRatePct: 0.1,
    rateBasis: "bank-passbook",
    minHoldingMonths: 12,
    payTiming: "Annually.",
    summary:
      "If the deposit exceeds one month's rent and the term is at least one year, the landlord must pay annual interest equal to the passbook savings rate.",
    cite: {
      statute: "N.M. Stat. § 47-8-18",
      statuteUrl: "https://law.justia.com/codes/new-mexico/chapter-47/article-8/section-47-8-18/",
      lastVerified: VERIFIED,
      confidence: "low",
    },
  },
  NH: {
    required: "yes",
    defaultRatePct: 0.1,
    rateBasis: "bank-passbook",
    minHoldingMonths: 12,
    payTiming: "On request after one year, and at deposit return.",
    summary:
      "Deposits held for a year or more earn interest at the rate paid by the bank holding the deposit; tenants may request it annually.",
    cite: {
      statute: "N.H. Rev. Stat. § 540-A:6",
      statuteUrl: "https://www.gencourt.state.nh.us/rsa/html/lv/540-a/540-a-6.htm",
      lastVerified: VERIFIED,
      confidence: "low",
    },
  },
  DC: {
    required: "yes",
    defaultRatePct: 0.1,
    rateBasis: "published-annually",
    minHoldingMonths: 12,
    payTiming: "At the end of the tenancy.",
    summary:
      "Deposits earn interest at the statement-savings rate prevailing during the tenancy (published by DISB), paid when the tenancy ends.",
    cite: {
      statute: "D.C. Mun. Regs. tit. 14, § 311",
      statuteUrl: "https://www.dcregs.dc.gov/Common/DCMR/RuleList.aspx?ChapterNum=14-3",
      lastVerified: VERIFIED,
      confidence: "low",
    },
  },
};

/** Returned for any state not present in DEPOSIT_INTEREST above. */
export const NO_REQUIREMENT: DepositInterestRule = {
  required: "no",
  rateBasis: "none",
  minHoldingMonths: 0,
  payTiming: "Not applicable.",
  summary:
    "This state does not have a statewide law requiring landlords to pay interest on security deposits. Some cities may have their own rules, and the lease can still promise interest.",
  cite: {
    statute: "No statewide interest statute identified",
    lastVerified: VERIFIED,
    confidence: "medium",
  },
};

export const getDepositRule = (stateCode: string): DepositInterestRule =>
  DEPOSIT_INTEREST[stateCode] ?? NO_REQUIREMENT;

/** State codes that have a dedicated (substantive) rule page. */
export const depositRuleStateCodes = (): string[] =>
  Object.keys(DEPOSIT_INTEREST);
