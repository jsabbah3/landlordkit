/**
 * City-level security deposit interest rules — the cases where the state
 * answer is wrong for the state's biggest cities (California has no statewide
 * requirement; SF, LA and Berkeley do. Illinois's state rule only covers 25+
 * unit buildings; Chicago's RLTO covers most rentals).
 *
 * Every value verified 2026-10-19 against the city's own publication:
 *   SF       — sf.gov Rent Board "Security Deposits" + 3/1/26 rate notice
 *   Berkeley — rentboard.berkeleyca.gov deposit-interest calculator page
 *   LA       — LAHD Rent Stabilization Bulletin, Interest Payment on Security
 *              Deposit (PDF dated 2026-01-13)
 *   Chicago  — City of Chicago 2026 RLTO interest-rate lease rider + Comptroller
 *              notice; RLTO § 5-12-080
 * Rates reset annually (SF on March 1; Berkeley each fall; LA and Chicago each
 * January) — the staleness script will flag these after 180 days.
 */
import type { DepositInterestRule } from "./data";

export interface CityDepositRule extends DepositInterestRule {
  city: string;
  slug: string;
  stateCode: string;
  /** Who is covered, in one sentence. Rendered prominently. */
  scope: string;
  /** Consequence of not paying — the reason to care about tiny amounts. */
  penalty?: string;
  /** Prior-year rate, for "rates change" context. */
  priorRateNote?: string;
  example: { deposit: number; years: number };
  faqs: { q: string; a: string }[];
}

const V = "2026-10-19";

export const CITY_DEPOSIT_INTEREST: CityDepositRule[] = [
  {
    city: "San Francisco",
    slug: "san-francisco",
    stateCode: "CA",
    required: "yes",
    defaultRatePct: 4.2,
    rateBasis: "published-annually",
    minHoldingMonths: 12,
    scope:
      "All residential rental units in San Francisco — including units exempt from rent control — except where the rent is assisted or subsidized by a government agency.",
    payTiming:
      "Every year on the tenant's annual due date (the anniversary of when you received the deposit), and within two weeks after the tenant moves out.",
    summary:
      "San Francisco landlords must pay interest on security deposits held at least one full year, at a rate the Rent Board sets each March. For March 1, 2026 – February 28, 2027 the rate is 4.2%. If the tenant leaves before a full year, no interest is due; after that, a partial final year is prorated at the rate in effect when they move out.",
    rateLabel: "4.2% (Mar 1, 2026 – Feb 28, 2027; resets each March)",
    priorRateNote: "The rate was 5.0% for March 2025 – February 2026.",
    cite: {
      statute: "S.F. Admin. Code ch. 49 (Security Deposit Interest)",
      statuteUrl: "https://www.sf.gov/reports--security-deposits",
      lastVerified: V,
      confidence: "high",
    },
    example: { deposit: 3000, years: 1 },
    faqs: [
      {
        q: "Does San Francisco's deposit interest rule apply to units that aren't rent controlled?",
        a: "Yes. The interest requirement covers all residential rental units in San Francisco, including units exempt from the Rent Ordinance. The exception is units whose rent is assisted or subsidized by a government agency.",
      },
      {
        q: "What is the San Francisco security deposit interest rate for 2026?",
        a: "4.2% for the period March 1, 2026 through February 28, 2027, set by the Rent Board from the prior year's average 90-day commercial paper rate. It was 5.0% the year before, so check the rate each March.",
      },
      {
        q: "Do I owe interest if my tenant moves out after eight months?",
        a: "No. If the tenant vacates before one full year of occupancy, no interest is due. Once they pass a year, interest is owed annually, and any partial final year is prorated at the rate in effect when they move out — payable within two weeks of move-out.",
      },
    ],
  },
  {
    city: "Los Angeles",
    slug: "los-angeles",
    stateCode: "CA",
    required: "yes",
    defaultRatePct: 3.03,
    rateBasis: "published-annually",
    minHoldingMonths: 12,
    scope:
      "Rent-stabilized (RSO) units in the City of Los Angeles — generally rental units with a certificate of occupancy first issued before October 1, 1978. Deposits held at least one year earn interest.",
    payTiming:
      "Annually, for deposits held at least one year. You may pay either the Rent Adjustment Commission's rate or the interest the deposit actually earned — if you pay actual earnings, give the tenant a copy of the bank statement showing them.",
    summary:
      "City of Los Angeles landlords with RSO units must pay interest on security deposits held at least one year. The Rent Adjustment Commission set the 2026 rate at 3.03% (down from 4.32% in 2025). Since 2004 landlords may instead pay the actual interest earned, documented with a bank statement.",
    rateLabel: "3.03% for 2026 (set each January)",
    priorRateNote: "The 2025 rate was 4.32%.",
    cite: {
      statute: "L.A. Rent Stabilization Ordinance — LAHD Bulletin: Interest Payment on Security Deposit (Jan. 13, 2026)",
      statuteUrl:
        "https://housing.lacity.gov/wp-content/uploads/2023/01/44-Interest-Payments-on-Security-Deposits-English.pdf",
      lastVerified: V,
      confidence: "high",
    },
    example: { deposit: 2500, years: 1 },
    faqs: [
      {
        q: "Which Los Angeles rentals owe security deposit interest?",
        a: "Units covered by the City of Los Angeles Rent Stabilization Ordinance — generally rentals whose certificate of occupancy was first issued before October 1, 1978. Newer buildings and units outside city limits (e.g. Santa Monica, West Hollywood, unincorporated LA County) follow their own rules.",
      },
      {
        q: "What is the LA RSO security deposit interest rate for 2026?",
        a: "3.03%, set by the Rent Adjustment Commission (LAHD bulletin dated January 13, 2026). The 2025 rate was 4.32%. You may pay the actual interest your bank paid instead, if you give the tenant the bank statement.",
      },
      {
        q: "Does West Hollywood use the same rate?",
        a: "No. West Hollywood runs its own rent stabilization program with its own deposit-interest rate. These figures apply only to RSO units in the City of Los Angeles.",
      },
    ],
  },
  {
    city: "Berkeley",
    slug: "berkeley",
    stateCode: "CA",
    required: "yes",
    defaultRatePct: 0.9,
    rateBasis: "published-annually",
    minHoldingMonths: 0,
    scope: "Units fully or partially covered by Berkeley's Rent Stabilization Ordinance.",
    payTiming:
      "Every December (cash or a rent rebate), no later than January 31. At move-out, interest is computed at the Rent Board's rate for the month the tenant leaves.",
    summary:
      "Berkeley landlords must pay deposit interest annually each December for units covered by the Rent Ordinance. The rate for the December 2025 payment was 0.9%; the Rent Board also publishes a monthly move-out rate (0.6% for October 2026 move-outs). Miss the January 31 deadline and the tenant may recover interest at 10% for that year.",
    rateLabel: "0.9% (Dec 2025 annual payment); move-out rate set monthly",
    penalty:
      "If the December payment isn't made by January 31, the tenant may recover interest at 10% for the preceding calendar year.",
    cite: {
      statute: "Berkeley Rent Stabilization Ordinance (B.M.C. ch. 13.76) & Rent Board regulations",
      statuteUrl:
        "https://rentboard.berkeleyca.gov/rights-responsibilities/security-deposits/security-deposit-interest-calculator",
      lastVerified: V,
      confidence: "high",
    },
    example: { deposit: 2000, years: 1 },
    faqs: [
      {
        q: "When is Berkeley security deposit interest due?",
        a: "Every December, as cash or a rent rebate, and no later than January 31. If you miss that deadline the tenant may recover interest at 10% for the preceding calendar year.",
      },
      {
        q: "What rate applies when a Berkeley tenant moves out?",
        a: "The Rent Board publishes a rate for each month of move-outs — 0.6% for October 2026, for example. Use the rate for the month the tenant vacates, not the annual December rate.",
      },
      {
        q: "Does Berkeley's rule cover every rental?",
        a: "It covers units fully or partially covered by the Rent Stabilization Ordinance. Because coverage can be partial, the Rent Board recommends confirming a specific unit's status with its staff.",
      },
    ],
  },
  {
    city: "Chicago",
    slug: "chicago",
    stateCode: "IL",
    required: "yes",
    defaultRatePct: 0.01,
    rateBasis: "published-annually",
    minHoldingMonths: 6,
    scope:
      "Most Chicago rentals under the Residential Landlord and Tenant Ordinance (RLTO). The most common exemption is an owner-occupied building with six or fewer units. Unlike Illinois's state law, there is no 25-unit threshold.",
    payTiming:
      "For deposits held more than six months: within 30 days after the end of each 12-month rental period, in cash or as a credit against rent.",
    summary:
      "Chicago's RLTO requires interest on security deposits held more than six months, at a rate the City Comptroller sets each year — 0.01% for 2026. The amount is tiny, but the penalty isn't: a violation lets the tenant recover two times the deposit plus interest. Leases must also include the city's interest-rate rider.",
    rateLabel: "0.01% for 2026 (set each January)",
    penalty:
      "Two times the security deposit plus interest for violations (RLTO § 5-12-080(f)), plus attorney's fees.",
    cite: {
      statute: "Chicago Mun. Code § 5-12-080 (RLTO)",
      statuteUrl:
        "https://www.chicago.gov/content/dam/city/depts/doh/general/SD%20Interest%20Rate%20Lease%20Rider_2026.pdf",
      lastVerified: V,
      confidence: "high",
    },
    example: { deposit: 1500, years: 1 },
    faqs: [
      {
        q: "Is the Chicago deposit interest rate really 0.01%?",
        a: "Yes — the City Comptroller set it at 0.01% for 2026, based on Chase savings and CD rates. On a $1,500 deposit that's 15 cents a year. The reason to get it right anyway is the penalty: a violation can cost two times the deposit plus interest.",
      },
      {
        q: "Does the Chicago RLTO apply to my two-flat?",
        a: "Owner-occupied buildings with six or fewer units are generally exempt from the RLTO. If you don't live in the building, or it has seven or more units, assume the RLTO applies.",
      },
      {
        q: "How is Chicago different from the Illinois state rule?",
        a: "Illinois's Security Deposit Interest Act only covers buildings with 25 or more units. Chicago's RLTO has no such threshold, so far more Chicago landlords owe interest — at the city's rate, with a required lease rider.",
      },
    ],
  },
];

export const getCityRule = (stateCode: string, citySlug: string): CityDepositRule | undefined =>
  CITY_DEPOSIT_INTEREST.find((c) => c.stateCode === stateCode && c.slug === citySlug);

export const citiesForState = (stateCode: string): CityDepositRule[] =>
  CITY_DEPOSIT_INTEREST.filter((c) => c.stateCode === stateCode);
