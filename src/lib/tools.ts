/**
 * Central registry of every LandlordKit tool. Drives the homepage directory,
 * internal linking, breadcrumbs, and the XML sitemap. Adding a tool here (and
 * its page) is the only step needed to surface it across the site.
 */
export type ToolStatus = "live" | "planned";

export interface ToolDef {
  slug: string; // URL segment under /tools/
  name: string; // full display name
  short: string; // nav / card label
  blurb: string; // one-line description
  category: "Legal & compliance" | "Documents" | "Investing & finance";
  stateAware: boolean; // has /tools/<slug>/<state> programmatic pages
  status: ToolStatus;
  priority: number; // launch ranking from Phase 1 (1 = build first)
}

export const TOOLS: ToolDef[] = [
  {
    slug: "security-deposit-interest-calculator",
    name: "Security Deposit Interest Calculator",
    short: "Deposit interest",
    blurb:
      "Calculate the interest you owe a tenant on their security deposit, with your state's exact rule and statute.",
    category: "Legal & compliance",
    stateAware: true,
    status: "live",
    priority: 1,
  },
  {
    slug: "rent-increase-notice-generator",
    name: "Rent Increase Notice Generator",
    short: "Rent increase notice",
    blurb:
      "Generate a compliant rent increase letter with your state's required notice period — download a clean PDF.",
    category: "Documents",
    stateAware: true,
    status: "live",
    priority: 2,
  },
  {
    slug: "late-fee-calculator",
    name: "Rent Late Fee Calculator",
    short: "Late fee",
    blurb:
      "Check your state's legal late-fee cap and grace period, then calculate a compliant late fee.",
    category: "Legal & compliance",
    stateAware: true,
    status: "live",
    priority: 3,
  },
  {
    slug: "security-deposit-return-tracker",
    name: "Security Deposit Return Tracker",
    short: "Deposit return",
    blurb:
      "See your state's deposit return deadline and itemization rules, and generate an itemized deductions statement.",
    category: "Legal & compliance",
    stateAware: true,
    status: "live",
    priority: 4,
  },
  {
    slug: "lease-renewal-letter-generator",
    name: "Lease Renewal Letter Generator",
    short: "Lease renewal",
    blurb: "Create a professional lease renewal offer letter in seconds.",
    category: "Documents",
    stateAware: false,
    status: "live",
    priority: 5,
  },
  {
    slug: "rent-receipt-generator",
    name: "Rent Receipt Generator",
    short: "Rent receipt",
    blurb: "Generate a polished rent receipt PDF instantly — no signup.",
    category: "Documents",
    stateAware: false,
    status: "live",
    priority: 6,
  },
  {
    slug: "prorated-rent-calculator",
    name: "Prorated Rent Calculator",
    short: "Prorated rent",
    blurb: "Calculate fair prorated rent for a partial first or last month.",
    category: "Investing & finance",
    stateAware: false,
    status: "live",
    priority: 7,
  },
  {
    slug: "rental-cash-flow-calculator",
    name: "Rental Cash Flow Calculator",
    short: "Cash flow",
    blurb:
      "Estimate monthly cash flow and cash-on-cash return on a rental property.",
    category: "Investing & finance",
    stateAware: false,
    status: "live",
    priority: 8,
  },
];

export const liveTools = (): ToolDef[] => TOOLS.filter((t) => t.status === "live");
export const getTool = (slug: string): ToolDef | undefined =>
  TOOLS.find((t) => t.slug === slug);
export const toolPath = (slug: string): string => `/tools/${slug}`;
