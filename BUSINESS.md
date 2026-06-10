# BUSINESS.md — Model, costs, and the weekly dashboard

## The goal

$1,000/month within 6–12 months. That's roughly **80 Pro subscribers at
$12/mo**, or ~50 subscribers + display ads once traffic builds.

## Who we serve

The ~10–11M Americans who own 1–10 rental units. They search constantly for
**state-specific** legal/financial answers, have real money at stake, and are
underserved by enterprise property-management software and generic templates.

## Why this can rank: programmatic SEO that isn't thin

US landlord-tenant law genuinely varies by state, so each state page is real,
differentiated content (different rates, statutes, notice periods, worked
examples). Our durable edge over the closest competitor (RentLateFee.com) is the
three things they skip: **statute citations + last-verified dates**, **polished
PDF document outputs**, and **correct handling of legal nuance** (holding-period
gates, exempt amounts, indexed rates).

Page math toward 200–400 indexable pages:

| Tool | States with a real rule | Pages |
|---|---|---|
| Security deposit interest | ~12 (only ~15 states require it) | 12 |
| Rent increase notice | 50 + DC | 51 |
| Late fee | 50 + DC | 51 |
| Security deposit return | 50 + DC | 51 |
| Non-state tools (lease renewal, receipt, prorate, cash flow) | landing each | 4 |
| Tool landings, home, pricing, guides, legal | — | ~17 |
| Guides | 2 published, 8 scaffolded | 2 |

Live today: **187 static pages (~165 state pages)**. All 8 launch tools shipped.
Next growth: publish the 8 scaffolded guides (≈1/week) and deepen low-confidence
state data.

> **Note on the "crown jewel":** only ~15 states legally require security deposit
> interest, so that tool is ~12–18 deep pages, **not** 50. Don't build thin "no
> requirement" pages for the other 35 — the volume comes from the other
> state-aware tools where all 50 genuinely differ.

## Revenue model

1. **Pro subscription — $12/mo or $99/yr** (primary). Upgrade triggers placed at
   natural moments (after generating a document, when re-entering info): saved
   property details, batch generation, watermark-free branded PDFs, portfolio
   dashboard, all future tools.
2. **Display ads** (secondary, later). Add only once traffic is meaningful
   (e.g. 20k+ sessions/mo) and only on content/guide pages, never on the tool
   interaction itself. Ezoic/Mediavine-style.

Conversion assumption: utility tools convert free→paid at **1–3%**. At 2% of,
say, 4,000 visitors/mo who engage, that's a slow build — the lever is **traffic
volume × number of tools**, which is why distribution is baked into the product.

## Operating costs (target: under $20/mo)

| Service | Plan | Cost |
|---|---|---|
| Vercel | Hobby (free) | $0 |
| Supabase | Free tier | $0 |
| Stripe | Pay-as-you-go | ~2.9% + 30¢ per charge only |
| Domain | annual | ~$1–2/mo amortized |
| Plausible | starter | ~$9/mo (or GA4 = $0) |
| Resend | Free tier | $0 |
| **Total** | | **~$10–12/mo** |

Because all compute is client-side and pages are static, **cost stays flat as
traffic grows** — Vercel's free tier serves static assets generously. Revisit
paid tiers only if you exceed free limits (a good problem).

## Unit economics

- Stripe takes ~$0.65 on a $12 charge → **~$11.35 net per Pro/mo**.
- ~2 Pro subscribers already cover monthly operating costs.
- 80 Pro subscribers ≈ **$908 net/mo** + any ad revenue → goal met.

## Weekly dashboard (watch these every week)

Pull from Plausible/GA4 + Stripe + Search Console:

1. **Organic sessions** (total + top landing pages) — the growth engine.
2. **Indexed pages** (Search Console Coverage) — are new state pages getting in?
3. **Top queries + average position** (Search Console) — what's almost ranking?
4. **Tool usage events** (`tool_used`, `pdf_downloaded`) — are tools being used?
5. **Funnel:** `upgrade_prompt_shown` → `upgrade_clicked` → Stripe checkouts →
   new Pro subs. Watch the drop-off at each step.
6. **Active Pro subscribers + MRR + churn** (Stripe).
7. **Cost check** — still under $20/mo?

## Milestones

- **M1 (live):** 79 pages indexed, Search Console clean, 2 tools.
- **M2 (~month 2–3):** all 8 tools + 200+ pages, first organic Pro signups.
- **M3 (~month 6):** few thousand organic sessions/mo, ~20–40 Pro subs.
- **M4 (~month 9–12):** $1,000/mo via ~80 subs and/or ads on traffic.
