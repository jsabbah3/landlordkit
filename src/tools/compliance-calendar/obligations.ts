import type { LegalProvenance } from "@/lib/legal";

/* ============================================================================
 * COMPLIANCE CALENDAR — obligation dataset
 * ----------------------------------------------------------------------------
 * Recurring filing/compliance obligations for landlords, by jurisdiction.
 * FEDERAL is uniform and high-confidence. STATE (LLC) and CITY entries are
 * filled by a cited, cross-checked research pass (same discipline as the legal
 * DB) — anything not yet researched simply isn't listed, and the UI tells the
 * user to add custom deadlines for jurisdictions we don't cover.
 *
 * ⚠️ Not tax/legal advice. Dates can shift for weekends/holidays; `varies`
 *    items are intentionally undated.
 * ========================================================================== */

export type EntityType = "individual" | "llc";

export interface ComplianceProfile {
  state: string; // USPS code
  city: string | null; // covered-city slug or null
  entityType: EntityType;
  llcFormationDate?: string; // ISO; enables anniversary-based items
  usesContractors: boolean;
  builtPre1978: boolean;
  units: number;
}

export type Condition =
  | { type: "always" }
  | { type: "entity"; value: EntityType }
  | { type: "usesContractors" }
  | { type: "builtPre1978" }
  | { type: "unitsAtLeast"; n: number };

export type DueType = "fixed" | "anniversary" | "varies";

export interface Obligation {
  id: string;
  jurisdiction: "federal" | "state" | "city";
  scope: string; // "federal" | state code | city slug
  title: string;
  what: string;
  fileWith: string;
  dueType: DueType;
  /** MM-DD strings for fixed obligations (one or many per year). */
  dueDates?: string[];
  /** For anniversary: months offset from llcFormationDate's month. */
  anchorField?: "llcFormationDate";
  /** Recurrence in years (1 = annual, 2 = biennial). Default 1. */
  everyYears?: number;
  conditions: Condition[]; // ALL must match
  cite: LegalProvenance;
  sources: string[];
}

const IRS = "IRS";

export const FEDERAL_OBLIGATIONS: Obligation[] = [
  {
    id: "fed-1099-nec",
    jurisdiction: "federal",
    scope: "federal",
    title: "File 1099-NEC for contractors",
    what: "If you paid any unincorporated contractor (handyman, plumber, etc.) $600 or more for services on your rental during the year, file Form 1099-NEC with the IRS and send a copy to the contractor.",
    fileWith: "IRS + your contractors",
    dueType: "fixed",
    dueDates: ["01-31"],
    conditions: [{ type: "usesContractors" }],
    cite: {
      statute: "IRS Form 1099-NEC instructions",
      statuteUrl: "https://www.irs.gov/forms-pubs/about-form-1099-nec",
      lastVerified: "2026-06-15",
      confidence: "high",
    },
    sources: ["IRS", "IRS General Instructions for Information Returns"],
  },
  {
    id: "fed-schedule-e",
    jurisdiction: "federal",
    scope: "federal",
    title: "Report rental income (Schedule E)",
    what: "Report your rental income and expenses on Schedule E, filed with your federal Form 1040. The deadline shifts to the next business day if it falls on a weekend/holiday.",
    fileWith: "IRS",
    dueType: "fixed",
    dueDates: ["04-15"],
    conditions: [{ type: "always" }],
    cite: {
      statute: "IRS Schedule E (Form 1040)",
      statuteUrl: "https://www.irs.gov/forms-pubs/about-schedule-e-form-1040",
      lastVerified: "2026-06-15",
      confidence: "high",
    },
    sources: ["IRS", "IRS Publication 527 (Residential Rental Property)"],
  },
  {
    id: "fed-estimated-tax",
    jurisdiction: "federal",
    scope: "federal",
    title: "Pay quarterly estimated taxes",
    what: "If you expect to owe $1,000+ in federal tax on your rental (and other) income, pay quarterly estimated taxes with Form 1040-ES. Skip if your withholding already covers it.",
    fileWith: IRS,
    dueType: "fixed",
    dueDates: ["04-15", "06-15", "09-15", "01-15"],
    conditions: [{ type: "always" }],
    cite: {
      statute: "IRS Form 1040-ES",
      statuteUrl: "https://www.irs.gov/forms-pubs/about-form-1040-es",
      lastVerified: "2026-06-15",
      confidence: "high",
    },
    sources: ["IRS", "IRS Estimated Taxes (Topic 505)"],
  },
  {
    id: "fed-w9",
    jurisdiction: "federal",
    scope: "federal",
    title: "Collect W-9s before paying contractors",
    what: "Before you pay a contractor, collect a signed Form W-9 so you have the info to issue a 1099-NEC in January. Not a dated deadline — do it as you hire.",
    fileWith: "Keep on file",
    dueType: "varies",
    conditions: [{ type: "usesContractors" }],
    cite: {
      statute: "IRS Form W-9",
      statuteUrl: "https://www.irs.gov/forms-pubs/about-form-w-9",
      lastVerified: "2026-06-15",
      confidence: "high",
    },
    sources: ["IRS"],
  },
];

/** State (entity/LLC) obligations, keyed by code. NY verified; rest = research pass. */
export const STATE_OBLIGATIONS: Record<string, Obligation[]> = {
  NY: [
    {
      id: "ny-biennial-statement",
      jurisdiction: "state",
      scope: "NY",
      title: "File NY LLC Biennial Statement",
      what: "Every two years, file a Biennial Statement with the NY Department of State ($9). It's due within the calendar month in which your LLC's articles of organization were filed.",
      fileWith: "NY Department of State",
      dueType: "anniversary",
      anchorField: "llcFormationDate",
      everyYears: 2,
      conditions: [{ type: "entity", value: "llc" }],
      cite: {
        statute: "N.Y. LLC Law § 301(e)",
        statuteUrl: "https://dos.ny.gov/biennial-statements-business-corporations-and-limited-liability-companies",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["NY Department of State", "Nolo: NY LLC annual report requirements"],
    },
    {
      id: "ny-it204ll",
      jurisdiction: "state",
      scope: "NY",
      title: "File NY LLC annual filing fee (IT-204-LL)",
      what: "LLCs with NY-source gross income file Form IT-204-LL and pay an annual fee ($25–$4,500 by income) with NY Tax & Finance, due the 15th day of the 3rd month after your tax year ends (March 15 for a calendar year).",
      fileWith: "NY Dept. of Taxation & Finance",
      dueType: "fixed",
      dueDates: ["03-15"],
      conditions: [{ type: "entity", value: "llc" }],
      cite: {
        statute: "N.Y. Tax Law § 658(c)(3); Form IT-204-LL",
        statuteUrl: "https://www.tax.ny.gov/pit/efile/it204ll.htm",
        lastVerified: "2026-06-15",
        confidence: "medium",
      },
      sources: ["NY Dept. of Taxation & Finance", "Nolo"],
    },
  ],
};

/** City-local obligations, keyed by city slug. NYC verified; rest = research pass. */
export const CITY_OBLIGATIONS: Record<string, Obligation[]> = {
  "new-york-city": [
    {
      id: "nyc-hpd-registration",
      jurisdiction: "city",
      scope: "new-york-city",
      title: "Register your property with NYC HPD",
      what: "File the annual Property Registration with HPD by September 1. Required for multiple dwellings (3+ units) and for 1–2 family homes where neither the owner nor immediate family lives. Failure blocks nonpayment cases and incurs penalties.",
      fileWith: "NYC Dept. of Housing Preservation & Development (PROS)",
      dueType: "fixed",
      dueDates: ["09-01"],
      conditions: [{ type: "always" }],
      cite: {
        statute: "NYC Housing Maintenance Code § 27-2097",
        statuteUrl: "https://www.nyc.gov/site/hpd/services-and-information/register-your-property.page",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["NYC HPD", "Warshaw Burstein LLP (Sept 1 deadline advisory)"],
    },
  ],
};

/** Covered cities for the picker. Brooklyn etc. fall under New York City. */
export const COVERED_CITIES: { slug: string; label: string; state: string }[] = [
  { slug: "new-york-city", label: "New York City (incl. Brooklyn, Queens, Bronx, Staten Island)", state: "NY" },
  { slug: "los-angeles", label: "Los Angeles", state: "CA" },
  { slug: "chicago", label: "Chicago", state: "IL" },
  { slug: "san-francisco", label: "San Francisco", state: "CA" },
  { slug: "seattle", label: "Seattle", state: "WA" },
  { slug: "washington-dc", label: "Washington, DC", state: "DC" },
  { slug: "boston", label: "Boston", state: "MA" },
  { slug: "philadelphia", label: "Philadelphia", state: "PA" },
  { slug: "minneapolis", label: "Minneapolis", state: "MN" },
  { slug: "baltimore", label: "Baltimore", state: "MD" },
  { slug: "portland", label: "Portland, OR", state: "OR" },
  { slug: "san-diego", label: "San Diego", state: "CA" },
];
