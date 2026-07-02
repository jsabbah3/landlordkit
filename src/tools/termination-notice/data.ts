/**
 * Month-to-month TERMINATION notice (landlord → tenant), researched 2026-07-02.
 *
 * VERIFICATION METHOD (per the project's 2-source rule):
 *   - `high`: the statute's own text/page was confirmed in this research pass
 *     (state legislature site or statute text surfaced and read).
 *   - Values from aggregators alone were NOT included — one aggregator table
 *     checked (Stessa) contained at least two errors (CT listed with an
 *     eviction-notice figure; FL listed pre-2023 15 days). Florida's 2023
 *     HB 1417 change (15 → 30 days, eff. 2023-07-01) is reflected here.
 *
 * SCOPE NOTE: this is the baseline no-cause notice for a month-to-month
 * tenancy. States with just-cause/tenant-protection regimes (CA, NY, NJ, OR,
 * WA, CO, DC...) are deliberately NOT listed until their tiered rules are
 * researched — an oversimplified value there is worse than none. Add states
 * only with statute-level verification (see OPERATIONS.md research recipe).
 */
import type { LegalProvenance } from "@/lib/legal";

export interface TerminationNoticeRule {
  /** Baseline days of written notice the landlord must give. */
  noticeDays: number;
  /** e.g. "1 month" when the statute is phrased in months, else "N days". */
  summary: string;
  notes?: string;
  cite: LegalProvenance;
  /** Sources cross-checked this pass. */
  sources: string[];
}

const V = "2026-07-02";

export const TERMINATION_NOTICE: Record<string, TerminationNoticeRule> = {
  AK: {
    noticeDays: 30,
    summary: "30 days' written notice",
    cite: { statute: "Alaska Stat. § 34.03.290(b)", statuteUrl: "https://www.akleg.gov/basis/statutes.asp#34.03.290", lastVerified: V, confidence: "high" },
    sources: ["Alaska Statutes AS 34.03.290", "Alaska Court System PUB-30"],
  },
  FL: {
    noticeDays: 30,
    summary: "30 days' written notice (raised from 15 by HB 1417, eff. July 1, 2023)",
    notes: "Notice must be given before the end of the monthly period.",
    cite: { statute: "Fla. Stat. § 83.57(3)", statuteUrl: "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0083/Sections/0083.57.html", lastVerified: V, confidence: "high" },
    sources: ["Fla. Stat. § 83.57 (current)", "FL Senate CS/HB 1417 (2023) bill summary"],
  },
  IL: {
    noticeDays: 30,
    summary: "30 days' written notice",
    cite: { statute: "735 ILCS 5/9-207", statuteUrl: "https://www.ilga.gov/legislation/ilcs/fulltext.asp?DocName=073500050K9-207", lastVerified: V, confidence: "high" },
    sources: ["735 ILCS 5/9-207 (ilga.gov)", "Nolo state chart"],
    notes: "Chicago RLTO adds its own requirements for covered units.",
  },
  MI: {
    noticeDays: 30,
    summary: "1 month's notice (equal to the rental interval)",
    cite: { statute: "Mich. Comp. Laws § 554.134(1)", statuteUrl: "https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-554-134", lastVerified: V, confidence: "high" },
    sources: ["MCL 554.134 (legislature.mi.gov)", "MI courts benchbook"],
  },
  MO: {
    noticeDays: 30,
    summary: "1 month's written notice",
    cite: { statute: "Mo. Rev. Stat. § 441.060", statuteUrl: "https://revisor.mo.gov/main/OneSection.aspx?section=441.060", lastVerified: V, confidence: "high" },
    sources: ["RSMo § 441.060 (revisor.mo.gov)", "Nolo state chart"],
  },
  MT: {
    noticeDays: 30,
    summary: "30 days' written notice",
    cite: { statute: "Mont. Code Ann. § 70-24-441(2)", statuteUrl: "https://archive.legmt.gov/bills/mca/title_0700/chapter_0240/part_0040/section_0410/0700-0240-0040-0410.html", lastVerified: V, confidence: "high" },
    sources: ["MCA § 70-24-441 (legmt.gov)", "Stessa state chart"],
  },
  OH: {
    noticeDays: 30,
    summary: "30 days' notice before the periodic rental date",
    cite: { statute: "Ohio Rev. Code § 5321.17(B)", statuteUrl: "https://codes.ohio.gov/ohio-revised-code/section-5321.17", lastVerified: V, confidence: "high" },
    sources: ["ORC § 5321.17 (codes.ohio.gov)", "Stessa state chart"],
  },
  OR: {
    noticeDays: 30,
    summary: "30 days' written notice — first year of occupancy only",
    notes: "After the first year, Oregon generally requires cause (ORS 90.427); do not rely on a bare 30-day no-cause notice past year one.",
    cite: { statute: "ORS 91.070; ORS 90.427", statuteUrl: "https://www.oregonlegislature.gov/bills_laws/ors/ors091.html", lastVerified: V, confidence: "high" },
    sources: ["ORS 91.070 (oregonlegislature.gov)", "ORS 90.427"],
  },
  RI: {
    noticeDays: 30,
    summary: "30 days' written notice",
    cite: { statute: "R.I. Gen. Laws § 34-18-37", statuteUrl: "http://webserver.rilin.state.ri.us/statutes/title34/34-18/34-18-37.HTM", lastVerified: V, confidence: "high" },
    sources: ["R.I. Gen. Laws § 34-18-37 (rilin.state.ri.us)", "Justia"],
  },
  SD: {
    noticeDays: 30,
    summary: "1 month's notice from the landlord (tenant owes only 15 days)",
    cite: { statute: "S.D. Codified Laws § 43-32-13", statuteUrl: "https://sdlegislature.gov/Statutes/43-32-13", lastVerified: V, confidence: "high" },
    sources: ["SDCL § 43-32-13 (sdlegislature.gov)", "SD Consumer Protection"],
  },
  TX: {
    noticeDays: 30,
    summary: "1 month's notice (tenancy ends the later of the notice date or one month after notice)",
    cite: { statute: "Tex. Prop. Code § 91.001", statuteUrl: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.91.htm", lastVerified: V, confidence: "high" },
    sources: ["Tex. Prop. Code § 91.001 (statutes.capitol.texas.gov)", "texas.public.law"],
  },
  VA: {
    noticeDays: 30,
    summary: "30 days' written notice before the next rent due date",
    cite: { statute: "Va. Code § 55.1-1253(A)", statuteUrl: "https://law.lis.virginia.gov/vacode/title55.1/chapter12/section55.1-1253/", lastVerified: V, confidence: "high" },
    sources: ["Va. Code § 55.1-1253 (law.lis.virginia.gov)", "Nolo state chart"],
  },
  VT: {
    noticeDays: 60,
    summary: "60 days (tenancy ≤ 2 years) or 90 days (> 2 years) — no-written-agreement tenancies",
    notes: "9 V.S.A. § 4467 tiers the notice by length of occupancy; some municipalities add just-cause rules.",
    cite: { statute: "9 V.S.A. § 4467(c)", statuteUrl: "https://legislature.vermont.gov/statutes/section/09/137/04467", lastVerified: V, confidence: "high" },
    sources: ["9 V.S.A. § 4467 (legislature.vermont.gov)", "Justia"],
  },
};

export const terminationStateCodes = (): string[] => Object.keys(TERMINATION_NOTICE);
export const getTerminationRule = (code: string): TerminationNoticeRule | undefined =>
  TERMINATION_NOTICE[code?.toUpperCase()];
