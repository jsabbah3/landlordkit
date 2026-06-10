/**
 * Cornerstone guides for the /guides content hub. Each guide links to the
 * relevant tools (internal linking for SEO). Guides with a `sections` body are
 * published; the rest are scaffolded stubs for you to fill in (1/week — see
 * launch-checklist.md). Marking a stub `published: true` once written is the
 * only step needed to surface it in the sitemap.
 */
export interface GuideSection {
  h2: string;
  paragraphs: string[];
}

export interface Guide {
  slug: string;
  title: string;
  description: string;
  published: boolean;
  relatedTools: string[]; // tool slugs
  sections?: GuideSection[];
}

export const GUIDES: Guide[] = [
  {
    slug: "security-deposit-laws-by-state",
    title: "Security Deposit Laws by State: The Landlord's Guide",
    description:
      "Maximum deposits, interest requirements, and return deadlines for every US state — and how to stay compliant.",
    published: true,
    relatedTools: ["security-deposit-interest-calculator"],
    sections: [
      {
        h2: "Why security deposit rules trip up small landlords",
        paragraphs: [
          "Security deposits are one of the most heavily regulated parts of a tenancy, and the rules differ in almost every state. Three things vary the most: how much you can collect, whether you owe interest while you hold it, and how quickly you must return it after move-out.",
          "Getting any of these wrong is expensive. Many states let a tenant recover two or three times the deposit (plus attorney's fees) if you miss a return deadline or make an improper deduction. The good news: the rules are knowable, and a few habits keep you safe.",
        ],
      },
      {
        h2: "How much can you collect?",
        paragraphs: [
          "Most states cap the deposit at one to two months' rent, though a growing number have removed the cap entirely. Always check your specific state, and remember that 'last month's rent' collected up front is often treated as a deposit under the law.",
        ],
      },
      {
        h2: "Do you owe interest on the deposit?",
        paragraphs: [
          "About a dozen states — plus cities like Chicago and Berkeley — require you to pay the tenant interest on their deposit. The rate ranges from a fixed statutory figure (Massachusetts uses 5%) to a rate the state publishes each year, and some states only require interest after the deposit has been held for a minimum period.",
          "Use our security deposit interest calculator to compute the exact figure for your state, with the statute cited, and download a statement to give your tenant.",
        ],
      },
      {
        h2: "Returning the deposit on time",
        paragraphs: [
          "Return deadlines typically run 14 to 60 days after move-out, and most states require an itemized list of any deductions. Send the return and itemization by a method you can prove, and keep copies of move-in and move-out condition reports.",
        ],
      },
    ],
  },
  {
    slug: "how-much-notice-to-raise-rent",
    title: "How Much Notice Do You Need to Raise Rent?",
    description:
      "State-by-state notice periods for rent increases, when rent control applies, and how to send a notice that holds up.",
    published: true,
    relatedTools: ["rent-increase-notice-generator"],
    sections: [
      {
        h2: "The 30/60/90-day rule",
        paragraphs: [
          "For a month-to-month tenancy, most states require at least 30 days' written notice before a rent increase takes effect. But several states require more — and the required notice can grow with the size of the increase or the length of the tenancy.",
          "California, for example, requires 90 days' notice when the increase is more than 10% in a 12-month period. New York scales the notice with how long the tenant has lived there: 30, 60, or 90 days. Oregon and Washington require longer notice and also cap how much you can raise.",
        ],
      },
      {
        h2: "You usually can't raise rent mid-lease",
        paragraphs: [
          "During a fixed-term lease, the rent is locked unless the lease itself allows an increase. A rent increase normally takes effect at renewal or during a month-to-month tenancy. Trying to raise rent mid-term is one of the most common — and most easily avoided — mistakes.",
        ],
      },
      {
        h2: "Watch for rent control",
        paragraphs: [
          "Statewide caps now exist in California, Oregon, and Washington, and dozens of cities (especially in New Jersey, New York, and California) have their own local control with separate caps and notice rules. A local ordinance always overrides the state default, so check your city.",
        ],
      },
      {
        h2: "Send it the right way",
        paragraphs: [
          "Put the increase in writing, state the current and new rent and the effective date, and deliver it by a method you can prove. Our rent increase notice generator applies your state's notice period, flags rent-control caveats, and produces a clean PDF you can send.",
        ],
      },
    ],
  },
  // --- Scaffolded stubs (write 1/week) ---
  {
    slug: "how-to-calculate-rental-cash-flow",
    title: "How to Calculate Cash Flow on a Rental Property",
    description:
      "A plain-English walkthrough of rental cash flow, cap rate, and cash-on-cash return.",
    published: false,
    relatedTools: ["rental-cash-flow-calculator"],
  },
  {
    slug: "late-rent-fees-by-state",
    title: "Late Rent Fees by State: Caps, Grace Periods, and Pitfalls",
    description:
      "What you can legally charge for late rent in each state, and how to avoid void fees.",
    published: false,
    relatedTools: ["late-fee-calculator"],
  },
  {
    slug: "how-to-prorate-rent",
    title: "How to Prorate Rent (the Right Way)",
    description:
      "Three accepted methods for prorating a partial month — and which one to put in your lease.",
    published: false,
    relatedTools: ["prorated-rent-calculator"],
  },
  {
    slug: "rent-receipts-what-to-include",
    title: "Rent Receipts: What to Include and When You Must Give One",
    description:
      "Which states require rent receipts and what a compliant receipt should contain.",
    published: false,
    relatedTools: ["rent-receipt-generator"],
  },
  {
    slug: "returning-a-security-deposit",
    title: "Returning a Security Deposit Without Getting Sued",
    description:
      "Deadlines, allowed deductions, and itemization rules for returning a deposit.",
    published: false,
    relatedTools: ["security-deposit-return-tracker", "security-deposit-interest-calculator"],
  },
  {
    slug: "lease-renewal-vs-month-to-month",
    title: "Lease Renewal vs. Going Month-to-Month",
    description:
      "The trade-offs between renewing a fixed term and letting a tenancy roll month-to-month.",
    published: false,
    relatedTools: ["lease-renewal-letter-generator"],
  },
  {
    slug: "first-rental-property-checklist",
    title: "Your First Rental Property: A Compliance Checklist",
    description:
      "The legal must-dos before and after you hand over the keys.",
    published: false,
    relatedTools: ["security-deposit-interest-calculator", "rent-increase-notice-generator"],
  },
  {
    slug: "landlord-record-keeping",
    title: "Record-Keeping for Small Landlords",
    description:
      "What to track for taxes, disputes, and a clean handoff at move-out.",
    published: false,
    relatedTools: ["rent-receipt-generator", "rental-cash-flow-calculator"],
  },
];

export const publishedGuides = (): Guide[] => GUIDES.filter((g) => g.published);
export const getGuide = (slug: string): Guide | undefined =>
  GUIDES.find((g) => g.slug === slug);
