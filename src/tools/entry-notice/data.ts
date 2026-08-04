/**
 * LANDLORD ENTRY NOTICE (landlord → tenant), researched 2026-08-03.
 *
 * VERIFICATION METHOD (per the project's 2-source rule):
 *   - `high`: the statute's own text was pulled from the state legislature /
 *     revisor site and read in full during this pass. Every entry below was
 *     verified that way — no value here came from an aggregator table.
 *   - Aggregators were used only to locate citations, never as the source of
 *     a value (OPERATIONS.md §6).
 *
 * SCOPE NOTE: `hours` is the notice a landlord must give before a routine,
 * non-emergency entry (inspection / repairs). Every state below carves out
 * emergencies, and several set a DIFFERENT (usually shorter) period for
 * showing the unit to prospective buyers or tenants — that lives in `notes`,
 * because collapsing it into one number is exactly the oversimplification
 * this dataset exists to avoid.
 *
 * NUANCE THAT MATTERS: in CA and FL the statutory figure is a *presumption* or
 * is scoped to a specific purpose, not a flat rule. Do not restate either as
 * "the landlord must give 24 hours" without the qualifier.
 *
 * States absent from this file are left UNVERIFIED in the unified DB, not
 * guessed. Note that many states (e.g. Missouri, Texas) have NO statutory
 * entry-notice requirement at all — those must not be added with a value;
 * they need a separate "no statute" treatment. Add states only with
 * statute-level verification.
 */
import type { LegalProvenance } from "@/lib/legal";

export interface EntryNoticeRule {
  /** Hours of advance notice required for routine non-emergency entry. */
  hours: number;
  /** Human-readable statement of the rule, including any qualifier. */
  summary: string;
  /** Carve-outs: showings, business-hours limits, presumption language. */
  notes?: string;
  cite: LegalProvenance;
  /** Sources cross-checked this pass. */
  sources: string[];
}

const V = "2026-08-03";

export const ENTRY_NOTICE: Record<string, EntryNoticeRule> = {
  CA: {
    hours: 24,
    summary:
      "Reasonable written notice; 24 hours is presumed reasonable. Entry during normal business hours.",
    notes:
      "Cal. Civ. Code § 1954(d)(1) requires 'reasonable notice in writing' and states that 24 hours 'shall be presumed to be reasonable notice in absence of evidence to the contrary' — it is a rebuttable presumption, not a fixed minimum. Notice mailed at least 6 days before entry is also presumed reasonable. For showings to prospective or actual purchasers, notice may be given orally if the tenant was notified in writing within the prior 120 days that the property is for sale (24 hours again presumed reasonable).",
    cite: {
      statute: "Cal. Civ. Code § 1954(d)(1)",
      statuteUrl:
        "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1954.",
      lastVerified: V,
      confidence: "high",
    },
    sources: ["Cal. Civ. Code § 1954 full text (leginfo.legislature.ca.gov)"],
  },
  FL: {
    hours: 24,
    summary:
      "24 hours' notice for repairs, between 7:30 a.m. and 8:00 p.m.",
    notes:
      "Fla. Stat. § 83.53(2) defines 'reasonable notice' as at least 24 hours ONLY for the purpose of repair, and 'reasonable time' as 7:30 a.m.–8:00 p.m. The statute sets no fixed notice period for the other entry purposes in § 83.53(1) (inspection, showings, agreed services); those instead turn on consent, emergency, unreasonably withheld consent, or extended tenant absence. The landlord may enter at any time to protect or preserve the premises.",
    cite: {
      statute: "Fla. Stat. § 83.53(2)",
      statuteUrl:
        "https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0000-0099/0083/Sections/0083.53.html",
      lastVerified: V,
      confidence: "high",
    },
    sources: ["Fla. Stat. § 83.53 full text (leg.state.fl.us)"],
  },
  WA: {
    hours: 48,
    summary:
      "Two days' written notice for entry; one day's notice to show the unit.",
    notes:
      "RCW 59.18.150(6) requires at least two days' written notice of intent to enter, except in an emergency or where impracticable. The notice must state the exact date(s) and time (or the earliest and latest possible times) and give a phone number the tenant can use to object or reschedule. A shorter one day's notice applies when the entry is to exhibit the unit to prospective or actual purchasers or tenants. Entry only at reasonable times.",
    cite: {
      statute: "Rev. Code Wash. § 59.18.150(6)",
      statuteUrl: "https://app.leg.wa.gov/RCW/default.aspx?cite=59.18.150",
      lastVerified: V,
      confidence: "high",
    },
    sources: ["RCW 59.18.150 full text (app.leg.wa.gov)"],
  },
};
