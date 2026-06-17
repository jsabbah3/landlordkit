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
  CA: [
    {
      id: "ca-franchise-tax",
      jurisdiction: "state",
      scope: "CA",
      title: "Pay CA $800 LLC franchise tax",
      what: "California LLCs owe an $800 minimum annual franchise tax (Form FTB 3522), due the 15th day of the 4th month of the tax year — April 15 for a calendar-year LLC.",
      fileWith: "CA Franchise Tax Board",
      dueType: "fixed",
      dueDates: ["04-15"],
      conditions: [{ type: "entity", value: "llc" }],
      cite: {
        statute: "Cal. Rev. & Tax. Code § 17941 (Form FTB 3522)",
        statuteUrl: "https://www.ftb.ca.gov/file/business/types/limited-liability-company/index.html",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["CA Franchise Tax Board", "LLC University"],
    },
    {
      id: "ca-form-568",
      jurisdiction: "state",
      scope: "CA",
      title: "File CA LLC return (Form 568)",
      what: "File Form 568 (LLC Return of Income) with the FTB, generally due the 15th day of the 4th month after your tax year ends (April 15 for calendar-year filers; March 15 if taxed as a partnership).",
      fileWith: "CA Franchise Tax Board",
      dueType: "fixed",
      dueDates: ["04-15"],
      conditions: [{ type: "entity", value: "llc" }],
      cite: {
        statute: "FTB Form 568",
        statuteUrl: "https://www.ftb.ca.gov/forms/2025/2025-568-booklet.html",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["CA Franchise Tax Board", "UpCounsel"],
    },
    {
      id: "ca-statement-of-information",
      jurisdiction: "state",
      scope: "CA",
      title: "File CA Statement of Information (LLC-12)",
      what: "Every two years, file a Statement of Information (Form LLC-12, $20) with the CA Secretary of State during the 6-month window ending in your formation anniversary month.",
      fileWith: "CA Secretary of State",
      dueType: "anniversary",
      anchorField: "llcFormationDate",
      everyYears: 2,
      conditions: [{ type: "entity", value: "llc" }],
      cite: {
        statute: "Cal. Corp. Code § 17702.09 (Form LLC-12)",
        statuteUrl: "https://bizfileonline.sos.ca.gov/",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["CA Secretary of State", "LLC University"],
    },
  ],
  MD: [
    {
      id: "md-lead-registration",
      jurisdiction: "state",
      scope: "MD",
      title: "Renew Maryland lead rental registration",
      what: "Maryland requires annual registration of pre-1978 rental units with the Maryland Department of the Environment (MDE), renewed by December 31 each year, along with a lead-inspection certificate.",
      fileWith: "Maryland Dept. of the Environment",
      dueType: "fixed",
      dueDates: ["12-31"],
      conditions: [{ type: "builtPre1978" }],
      cite: {
        statute: "Md. Code, Environment § 6-8 (Reduction of Lead Risk in Housing)",
        statuteUrl: "https://mde.maryland.gov/programs/land/leadpoisoningprevention/pages/index.aspx",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["Maryland Dept. of the Environment", "Baltimore City DHCD"],
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
  "los-angeles": [
    {
      id: "la-rent-registry",
      jurisdiction: "city",
      scope: "los-angeles",
      title: "File LA RSO Rent Registry + pay registration fee",
      what: "For rent-stabilized (RSO) units — generally buildings built before Oct 1978 — report each unit's rent and pay the annual RSO/SCEP registration fee to LAHD by the last day of February.",
      fileWith: "LA Housing Department (LAHD)",
      dueType: "fixed",
      dueDates: ["02-28"],
      conditions: [{ type: "builtPre1978" }],
      cite: {
        statute: "LAMC § 151.05 (Rent Stabilization Ordinance)",
        statuteUrl: "https://housing.lacity.gov/rental-property-owners/rent-registry",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["LA Housing Department", "California Apartment Association"],
    },
  ],
  chicago: [
    {
      id: "chicago-rlto-summary",
      jurisdiction: "city",
      scope: "chicago",
      title: "Attach the RLTO summary to leases",
      what: "Chicago has no general citywide rental-registration deadline, but the Residential Landlord and Tenant Ordinance (RLTO) requires attaching a current RLTO summary — and the annual security-deposit interest-rate summary — to every new or renewed lease.",
      fileWith: "Provide to tenant with each lease",
      dueType: "varies",
      conditions: [{ type: "always" }],
      cite: {
        statute: "Chicago Municipal Code Ch. 5-12 (RLTO)",
        statuteUrl: "https://www.chicago.gov/city/en/depts/doh/provdrs/landlords/svcs/residential-landlord-and-tenant-ordinance.html",
        lastVerified: "2026-06-15",
        confidence: "medium",
      },
      sources: ["City of Chicago (RLTO)"],
    },
  ],
  "san-francisco": [
    {
      id: "sf-rent-board-fee",
      jurisdiction: "city",
      scope: "san-francisco",
      title: "Pay SF Rent Board Fee + file Housing Inventory",
      what: "By March 1, pay the annual SF Rent Board Fee and submit the Housing Inventory report on the Rent Board portal (required before you can impose annual rent increases).",
      fileWith: "SF Rent Board",
      dueType: "fixed",
      dueDates: ["03-01"],
      conditions: [{ type: "always" }],
      cite: {
        statute: "SF Administrative Code Ch. 37 (Rent Ordinance)",
        statuteUrl: "https://www.sf.gov/rent-board-fee",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["SF Rent Board (SF.gov)", "Pacific Edge SF advisory"],
    },
  ],
  seattle: [
    {
      id: "seattle-rrio",
      jurisdiction: "city",
      scope: "seattle",
      title: "Renew Seattle RRIO rental registration",
      what: "Register all rental units under the Rental Registration & Inspection Ordinance (RRIO) and renew every 2 years (your renewal date is set when you register). A periodic inspection is also required.",
      fileWith: "Seattle Dept. of Construction & Inspections",
      dueType: "varies",
      conditions: [{ type: "always" }],
      cite: {
        statute: "Seattle Municipal Code Ch. 22.214 (RRIO)",
        statuteUrl: "https://www.seattle.gov/sdci/codes/codes-we-enforce-(a-z)/rental-registration-and-inspection-ordinance",
        lastVerified: "2026-06-15",
        confidence: "medium",
      },
      sources: ["Seattle SDCI", "Tenants Union of WA"],
    },
  ],
  "washington-dc": [
    {
      id: "dc-bbl",
      jurisdiction: "city",
      scope: "washington-dc",
      title: "Renew DC rental Basic Business License",
      what: "Operating a rental in DC requires a Basic Business License (Rental Housing), renewed every 2 years, plus keeping your Rental Accommodations Division (RAD) registration current. Your renewal date follows the license term.",
      fileWith: "DC Dept. of Licensing & Consumer Protection",
      dueType: "varies",
      conditions: [{ type: "always" }],
      cite: {
        statute: "D.C. Code § 47-2851.03d",
        statuteUrl: "https://dlcp.dc.gov/",
        lastVerified: "2026-06-15",
        confidence: "medium",
      },
      sources: ["DC DLCP", "DC DHCD (Rental Accommodations Division)"],
    },
  ],
  boston: [
    {
      id: "boston-rental-registration",
      jurisdiction: "city",
      scope: "boston",
      title: "Register your Boston rental (annual)",
      what: "Register every rental unit with the Inspectional Services Department by July 1 each year. Owner-occupied buildings of 6 or fewer units are fee-exempt but must still register.",
      fileWith: "Boston Inspectional Services Dept.",
      dueType: "fixed",
      dueDates: ["07-01"],
      conditions: [{ type: "always" }],
      cite: {
        statute: "Boston Municipal Code § 9-1.3 (Rental Registration)",
        statuteUrl: "https://www.boston.gov/departments/inspectional-services/how-register-rental-property",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["City of Boston (Boston.gov)", "KDS Law"],
    },
  ],
  philadelphia: [
    {
      id: "philly-rental-license",
      jurisdiction: "city",
      scope: "philadelphia",
      title: "Renew Philadelphia Rental License (annual)",
      what: "Renew your Rental License every year (valid 12 months from issuance) via eCLIPSE; you also need a Commercial Activity License and a Business Tax Account. Renewal date follows your issuance date.",
      fileWith: "Philadelphia Dept. of Licenses & Inspections",
      dueType: "varies",
      conditions: [{ type: "always" }],
      cite: {
        statute: "Phila. Code § 9-3902 (Rental Licenses)",
        statuteUrl: "https://www.phila.gov/services/permits-violations-licenses/get-a-license/business-licenses/rental-and-property/get-a-rental-license/",
        lastVerified: "2026-06-15",
        confidence: "medium",
      },
      sources: ["City of Philadelphia (phila.gov)", "TCS Property Mgmt"],
    },
  ],
  minneapolis: [
    {
      id: "minneapolis-rental-license",
      jurisdiction: "city",
      scope: "minneapolis",
      title: "Renew Minneapolis rental license (annual)",
      what: "Renew your rental dwelling license by March 1 each year (licenses expire at the end of February). Inspection frequency depends on your property's tier.",
      fileWith: "City of Minneapolis",
      dueType: "fixed",
      dueDates: ["03-01"],
      conditions: [{ type: "always" }],
      cite: {
        statute: "Minneapolis Code of Ordinances Title 12, Ch. 244",
        statuteUrl: "https://www2.minneapolismn.gov/business-services/licenses-permits-inspections/rental-licenses/",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["City of Minneapolis"],
    },
  ],
  baltimore: [
    {
      id: "baltimore-property-registration",
      jurisdiction: "city",
      scope: "baltimore",
      title: "Renew Baltimore property registration (annual)",
      what: "Register/renew all non-owner-occupied rental properties with Baltimore City DHCD by January 1 each year (the rental license term runs two years). (Lead registration is the separate Maryland MDE filing.)",
      fileWith: "Baltimore City DHCD",
      dueType: "fixed",
      dueDates: ["01-01"],
      conditions: [{ type: "always" }],
      cite: {
        statute: "Baltimore City Building, Fire & Related Codes (Property Registration)",
        statuteUrl: "https://www.baltimorecity.gov/dhcd/our-work/permit-inspections/property-registration",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["Baltimore City DHCD"],
    },
  ],
  portland: [
    {
      id: "portland-schedule-r",
      jurisdiction: "city",
      scope: "portland",
      title: "File Portland Residential Rental Registration (Schedule R)",
      what: "File Schedule R with your City of Portland/Multnomah County Business Tax Return by April 15, listing all rental units and paying the per-unit Residential Rental Registration fee.",
      fileWith: "Portland Revenue Division",
      dueType: "fixed",
      dueDates: ["04-15"],
      conditions: [{ type: "always" }],
      cite: {
        statute: "Portland City Code § 7.02; Policy LIC-5.09",
        statuteUrl: "https://www.portland.gov/phb/rental-services/residential-rental-registration",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["City of Portland (portland.gov)"],
    },
  ],
  "san-diego": [
    {
      id: "san-diego-rutbt",
      jurisdiction: "city",
      scope: "san-diego",
      title: "Pay San Diego Rental Unit Business Tax (annual)",
      what: "Pay the annual Rental Unit Business Tax to the City Treasurer, generally due March 1 (bills are mailed in January).",
      fileWith: "City of San Diego, Office of the City Treasurer",
      dueType: "fixed",
      dueDates: ["03-01"],
      conditions: [{ type: "always" }],
      cite: {
        statute: "San Diego Municipal Code § 31.0301 et seq.",
        statuteUrl: "https://www.sandiego.gov/treasurer/taxesfees/btax/rtaxinfo",
        lastVerified: "2026-06-15",
        confidence: "high",
      },
      sources: ["City of San Diego, Office of the City Treasurer"],
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
