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
    published: true,
    relatedTools: ["rental-cash-flow-calculator"],
    sections: [
      {
        h2: "Cash flow is just money in minus money out",
        paragraphs: [
          "Monthly cash flow is the rent you collect minus every cost of owning the property: the mortgage payment, property taxes, insurance, maintenance, management, and an honest allowance for vacancy. If the number is positive, the property pays you each month; if it's negative, you're feeding it.",
          "The mistake new investors make is counting only the mortgage. Budget 5–10% of rent for vacancy and another 5–10% for repairs and capital expenses (roofs and water heaters don't last forever). A property that looks profitable on paper often isn't once those reserves are included.",
        ],
      },
      {
        h2: "Cap rate vs. cash-on-cash return",
        paragraphs: [
          "Cap rate is net operating income (rent minus operating expenses, before the mortgage) divided by the purchase price. It lets you compare properties independent of how they're financed.",
          "Cash-on-cash return divides your annual pre-tax cash flow by the actual cash you put in (down payment, closing costs, and rehab). It answers the question that matters most to a small landlord: what return am I earning on the money I actually invested? Many investors look for cash-on-cash in the 7–12% range.",
        ],
      },
      {
        h2: "Run your numbers before you offer",
        paragraphs: [
          "Plug a realistic rent and your true expenses into the cash flow calculator before you make an offer. If the deal only works with rosy assumptions, it doesn't work. Re-run it at a higher interest rate and a higher vacancy to see how much cushion you have.",
        ],
      },
    ],
  },
  {
    slug: "late-rent-fees-by-state",
    title: "Late Rent Fees by State: Caps, Grace Periods, and Pitfalls",
    description:
      "What you can legally charge for late rent in each state, and how to avoid void fees.",
    published: true,
    relatedTools: ["late-fee-calculator"],
    sections: [
      {
        h2: "Three kinds of late-fee rules",
        paragraphs: [
          "States fall into three camps. Some set a hard cap as a percentage of rent (Maine is the strictest at 4%; Nevada and several others use 5%). Some set a flat or hybrid cap (New York limits the fee to the lesser of $50 or 5% of the rent). And many set no fixed cap at all, requiring only that the fee be 'reasonable' — a genuine estimate of the cost a late payment causes you.",
          "Grace periods vary just as much: Massachusetts forbids any late fee until rent is 30 days late, while other states allow one after a few days. Always check both the cap and the grace period for your state.",
        ],
      },
      {
        h2: "A fee above the cap is usually void",
        paragraphs: [
          "Here's the trap: if your lease sets a late fee higher than your state's legal limit, that clause is generally void and unenforceable — even though the tenant signed it. Charging it can expose you to penalties and weaken your position in an eviction. The lease can never override a statutory cap.",
        ],
      },
      {
        h2: "Keep it clean",
        paragraphs: [
          "Put a compliant late fee and grace period in the lease, apply it consistently to every tenant, and never let it exceed the state maximum. Use the late fee calculator to confirm the legal ceiling for your state before you bill.",
        ],
      },
    ],
  },
  {
    slug: "how-to-prorate-rent",
    title: "How to Prorate Rent (the Right Way)",
    description:
      "Three accepted methods for prorating a partial month — and which one to put in your lease.",
    published: true,
    relatedTools: ["prorated-rent-calculator"],
    sections: [
      {
        h2: "What prorating means",
        paragraphs: [
          "When a tenant moves in or out partway through a month, they should pay only for the days they actually have the unit. Prorating splits a full month's rent down to a daily rate and multiplies by the number of days occupied.",
        ],
      },
      {
        h2: "Three accepted methods",
        paragraphs: [
          "The actual-days method divides the monthly rent by the number of days in that specific month (28–31) and multiplies by days occupied. The 30-day (banker's) method always divides by 30, which is simpler and slightly more predictable. The annual method divides the yearly rent by 365 for the truest daily rate.",
          "All three are legitimate, and the difference is usually a few dollars. What matters is that your lease states which method you use, so there's no dispute. Without a stated method, courts generally expect the actual-days approach.",
        ],
      },
      {
        h2: "Put it in writing",
        paragraphs: [
          "Spell out the proration method in the lease and show the math on the first receipt. The prorated rent calculator does all three methods so you can pick one and document the figure.",
        ],
      },
    ],
  },
  {
    slug: "rent-receipts-what-to-include",
    title: "Rent Receipts: What to Include and When You Must Give One",
    description:
      "Which states require rent receipts and what a compliant receipt should contain.",
    published: true,
    relatedTools: ["rent-receipt-generator"],
    sections: [
      {
        h2: "When a receipt is required",
        paragraphs: [
          "Several states require a landlord to give a rent receipt, especially for cash payments — and a few (like Maryland and Massachusetts) require one on request regardless of payment method. Even where it isn't required, a receipt protects you: it's contemporaneous proof of what was paid and when, which is invaluable if a tenant later disputes their balance.",
        ],
      },
      {
        h2: "What a good receipt shows",
        paragraphs: [
          "Include the date, the amount paid, the payment method, the period the payment covers, the property address and unit, the tenant's name, and your name or your company's. Note any remaining balance or late fee so the running total is never ambiguous.",
        ],
      },
      {
        h2: "Make it a habit",
        paragraphs: [
          "Issue a receipt for every payment, not just cash, and keep a copy. The rent receipt generator produces a clean PDF in seconds — and Pro can batch them across every unit at once.",
        ],
      },
    ],
  },
  {
    slug: "returning-a-security-deposit",
    title: "Returning a Security Deposit Without Getting Sued",
    description:
      "Deadlines, allowed deductions, and itemization rules for returning a deposit.",
    published: true,
    relatedTools: ["security-deposit-return-tracker", "security-deposit-interest-calculator"],
    sections: [
      {
        h2: "Know your deadline",
        paragraphs: [
          "Every state sets a deadline to return the deposit after move-out — commonly 14 to 60 days. Miss it and you can forfeit the right to keep any of it, and in many states owe the tenant two or three times the amount plus their attorney's fees. The clock usually starts at the end of the tenancy or when the tenant gives a forwarding address, so calendar it immediately.",
        ],
      },
      {
        h2: "Deduct only what you can document",
        paragraphs: [
          "You can deduct unpaid rent and the cost of repairing damage beyond normal wear and tear — but not ordinary wear (faded paint, minor carpet wear). Most states require an itemized statement listing each deduction with amounts, and many expect receipts or estimates. Photos at move-in and move-out are your best evidence.",
        ],
      },
      {
        h2: "Don't forget interest",
        paragraphs: [
          "If you're in one of the states that requires interest on the deposit, you must include it in the return. Use the deposit return tracker to find your deadline and build an itemized statement, and the security deposit interest calculator to compute any interest owed.",
        ],
      },
    ],
  },
  {
    slug: "lease-renewal-vs-month-to-month",
    title: "Lease Renewal vs. Going Month-to-Month",
    description:
      "The trade-offs between renewing a fixed term and letting a tenancy roll month-to-month.",
    published: true,
    relatedTools: ["lease-renewal-letter-generator", "rent-increase-notice-generator"],
    sections: [
      {
        h2: "What happens when a lease ends",
        paragraphs: [
          "When a fixed-term lease expires, you generally have three choices: sign a new fixed-term lease, let the tenancy convert to month-to-month, or end the tenancy. In most states, if neither side acts, the tenancy automatically becomes month-to-month on the same terms.",
        ],
      },
      {
        h2: "The trade-off",
        paragraphs: [
          "A new fixed term gives you rent stability and a known occupancy period — good when you have a reliable tenant and a soft rental market. Month-to-month gives you flexibility to raise rent or regain the unit on short notice, but the tenant has the same flexibility to leave, raising your vacancy risk.",
          "Many landlords offer a renewal first and let it roll month-to-month only if the tenant prefers it — often with a small premium to offset the added turnover risk.",
        ],
      },
      {
        h2: "Send the offer early",
        paragraphs: [
          "Reach out 60–90 days before the lease ends so the tenant has time to decide and you have time to market the unit if they leave. The lease renewal letter generator produces a clean offer in seconds; if you're also raising the rent, check your state's notice period first.",
        ],
      },
    ],
  },
  {
    slug: "first-rental-property-checklist",
    title: "Your First Rental Property: A Compliance Checklist",
    description:
      "The legal must-dos before and after you hand over the keys.",
    published: true,
    relatedTools: ["security-deposit-interest-calculator", "rent-increase-notice-generator"],
    sections: [
      {
        h2: "Before the tenant moves in",
        paragraphs: [
          "Use a written lease that complies with your state's requirements, collect a deposit within the legal limit, and document the unit's condition with dated photos and a signed move-in checklist. Confirm where you'll hold the deposit — some states require a separate or interest-bearing account.",
        ],
      },
      {
        h2: "During the tenancy",
        paragraphs: [
          "Give receipts for payments, respond to repair requests promptly, and give proper written notice before entering. If you raise the rent, follow your state's notice period exactly. Keep every communication and payment in one place.",
        ],
      },
      {
        h2: "At move-out",
        paragraphs: [
          "Do a move-out inspection against the move-in checklist, return the deposit (with any required interest) by your state's deadline, and provide an itemized statement for any deductions. Missing the deadline is the single most common — and most expensive — first-landlord mistake.",
        ],
      },
    ],
  },
  {
    slug: "landlord-record-keeping",
    title: "Record-Keeping for Small Landlords",
    description:
      "What to track for taxes, disputes, and a clean handoff at move-out.",
    published: true,
    relatedTools: ["rent-receipt-generator", "rental-cash-flow-calculator"],
    sections: [
      {
        h2: "What to keep",
        paragraphs: [
          "Keep the signed lease and any addenda, every rent payment and receipt, all expense receipts (repairs, supplies, mileage, professional fees), insurance and tax documents, and a log of maintenance requests and your responses. Dated move-in and move-out photos belong here too.",
        ],
      },
      {
        h2: "Why it pays off",
        paragraphs: [
          "Good records turn tax time from a scramble into a copy-and-paste, substantiate every deduction if you're audited, and win disputes over deposits or unpaid rent because you can show exactly what happened and when. The cost of keeping them is minutes a month; the cost of not having them is measured in lost deductions and lost cases.",
        ],
      },
      {
        h2: "Keep it simple",
        paragraphs: [
          "A folder per property and a simple income/expense sheet is enough to start. Generate receipts as you collect rent, and track your cash flow as you go so you always know how each property is performing.",
        ],
      },
    ],
  },
];

export const publishedGuides = (): Guide[] => GUIDES.filter((g) => g.published);
export const getGuide = (slug: string): Guide | undefined =>
  GUIDES.find((g) => g.slug === slug);
