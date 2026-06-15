import type { LegalProvenance } from "@/lib/legal";

/* ============================================================================
 * SECURITY DEPOSIT MAXIMUM LIMITS — STATE DATA
 * ----------------------------------------------------------------------------
 * ⚠️  REVIEW BEFORE LAUNCH. Values cross-checked against 2+ reputable sources
 *     (Nolo, FindLaw, LawDistrict, Akerman state-comparison chart). States not
 *     listed are left UNVERIFIED in the unified DB — not guessed.
 *     `sources` lists the corroborating references for each entry.
 * ========================================================================== */

export interface DepositLimitRule {
  summary: string;
  cite: LegalProvenance;
  sources: string[];
}

const V = "2026-06-12";
const SRC = {
  nolo: "Nolo: State Laws on Security Deposit Limits",
  findlaw: "FindLaw: Security Deposit Limits",
  lawdistrict: "LawDistrict: Security Deposit Laws by State",
  akerman: "Akerman Security Deposit State Comparison Chart",
};

export const DEPOSIT_LIMIT: Record<string, DepositLimitRule> = {
  CA: {
    summary:
      "One month's rent (AB 12, effective July 1, 2024). A small landlord who owns no more than 2 residential properties with 4 or fewer total units may collect up to two months' rent.",
    cite: {
      statute: "Cal. Civ. Code § 1950.5",
      statuteUrl: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.5.",
      lastVerified: V,
      confidence: "high",
    },
    sources: [SRC.nolo, SRC.findlaw, "CA AB 12 (2023)"],
  },
  NY: {
    summary: "One month's rent (since the 2019 Housing Stability and Tenant Protection Act).",
    cite: {
      statute: "N.Y. Gen. Oblig. Law § 7-108",
      statuteUrl: "https://www.nysenate.gov/legislation/laws/GOB/7-108",
      lastVerified: V,
      confidence: "medium",
    },
    sources: [SRC.nolo, "NY HSTPA 2019"],
  },
  NJ: {
    summary: "1.5 months' rent.",
    cite: {
      statute: "N.J. Stat. § 46:8-21.2",
      statuteUrl: "https://law.justia.com/codes/new-jersey/title-46/section-46-8-21-2/",
      lastVerified: V,
      confidence: "high",
    },
    sources: [SRC.nolo, SRC.lawdistrict],
  },
  AZ: {
    summary: "1.5 months' rent (a tenant may voluntarily pay more).",
    cite: {
      statute: "Ariz. Rev. Stat. § 33-1321(A)",
      statuteUrl: "https://www.azleg.gov/ars/33/01321.htm",
      lastVerified: V,
      confidence: "high",
    },
    sources: [SRC.findlaw, SRC.lawdistrict],
  },
  MA: {
    summary: "One month's rent.",
    cite: {
      statute: "Mass. Gen. Laws ch. 186, § 15B",
      statuteUrl: "https://malegislature.gov/Laws/GeneralLaws/PartII/TitleI/Chapter186/Section15b",
      lastVerified: V,
      confidence: "high",
    },
    sources: [SRC.nolo, SRC.findlaw],
  },
  MI: {
    summary: "1.5 months' rent.",
    cite: {
      statute: "Mich. Comp. Laws § 554.602",
      statuteUrl: "https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-554-602",
      lastVerified: V,
      confidence: "high",
    },
    sources: [SRC.nolo, SRC.lawdistrict],
  },
  PA: {
    summary: "Up to 2 months' rent in the first year; no more than 1 month's rent thereafter.",
    cite: {
      statute: "68 Pa. Stat. § 250.511a",
      statuteUrl: "https://codes.findlaw.com/pa/title-68-ps-real-and-personal-property/pa-st-sect-68-250-511a/",
      lastVerified: V,
      confidence: "high",
    },
    sources: [SRC.nolo, SRC.findlaw],
  },
  VA: {
    summary: "2 months' rent.",
    cite: {
      statute: "Va. Code § 55.1-1226",
      statuteUrl: "https://law.lis.virginia.gov/vacode/55.1-1226/",
      lastVerified: V,
      confidence: "high",
    },
    sources: [SRC.nolo, SRC.lawdistrict],
  },
  TX: {
    summary: "No statutory limit on the deposit amount.",
    cite: {
      statute: "Tex. Prop. Code ch. 92 (no limit specified)",
      statuteUrl: "https://statutes.capitol.texas.gov/Docs/PR/htm/PR.92.htm",
      lastVerified: V,
      confidence: "high",
    },
    sources: [SRC.nolo, "DoorLoop: Texas Security Deposit Laws"],
  },
  FL: {
    summary: "No statutory limit on the deposit amount.",
    cite: {
      statute: "Fla. Stat. § 83.49 (no limit specified)",
      statuteUrl: "https://www.flsenate.gov/laws/statutes/2023/83.49",
      lastVerified: V,
      confidence: "high",
    },
    sources: [SRC.nolo, SRC.findlaw],
  },
  IL: {
    summary: "No statewide limit. Some cities (e.g., Chicago) impose their own rules.",
    cite: {
      statute: "765 ILCS 710 et seq. (no statewide limit)",
      statuteUrl: "https://www.ilga.gov/legislation/ilcs/ilcs5.asp?ActID=2202",
      lastVerified: V,
      confidence: "high",
    },
    sources: [SRC.nolo, SRC.lawdistrict],
  },
};

export const depositLimitStateCodes = (): string[] => Object.keys(DEPOSIT_LIMIT);
