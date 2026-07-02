# GROWTH.md — operating brain for the 90-day organic growth engine

Sprint start: 2026-07-02 (Fable 5 front-load sprint). Weekly ops manual: `OPERATIONS.md` (D6).

## Baseline (verified 2026-07-02)

| Metric | Value | Source |
|---|---|---|
| Sitemap URLs | 231 | live sitemap.xml |
| Schema | FAQPage, BreadcrumbList, SoftwareApplication, Organization on state pages; breadcrumb on guides | live HTML |
| Analytics | GA4 live (`G-63HPCDCY92`), full funnel events incl. `pro_subscribed` | verified in Realtime |
| Revenue | Stripe live; 1 Pro sub (founder). Funnel: prompt→click→checkout→subscribe instrumented | Stripe + GA4 |
| Email | Capture live (home + guides), Tax Prep Checklist magnet, `subscribers` table | verified |
| Robots/canonicals | Clean; GSC verified, sitemap submitted | live |
| Legal data confidence | HIGH: late fee (all 16 numeric-cap states), deposit interest (14), deposit max (10). MED/LOW: rent-increase, deposit-return (published, flagged). UNVERIFIED (unpublished): entry notice, termination/eviction notice, disclosures, habitability, rent-receipt rules | data files |

## Sprint log

- **D1 ✅ 2026-07-02** — audit clean, no critical fixes needed. GROWTH.md initialized.
- **D2 ✅ 2026-07-02** — (a) /laws hub system: 30 state hubs + index live (threshold ≥4 verified fields; more publish automatically as research raises coverage — no code change needed, just data). (b) NEW termination-notice dataset: 13 states verified at statute level (src/tools/termination-notice/data.ts), incl. catching Florida's 2023 HB 1417 change (15→30 days) that aggregator tables still get wrong. High-confidence fields 46→59. (c) DEFERRED with rationale: rent-receipt state pages + state-comparison pages — research recipes for both are in OPERATIONS.md; comparison pages held until per-state coverage is deeper (thinness risk). Sitemap now ~262 URLs.
- **D3 ✅ 2026-07-02** — Linkable assets live: (a) /reports/security-deposit-interest-2026 (SVG chart + full cited table + raw CSV at /csv); (b) /reports/landlord-regulation-index-2026 (transparent scoring from verified fields only; unscoreable states excluded honestly); (c) /embed program — 3 chrome-free iframe calculators with attribution backlinks + /embed instructions page; (d) /press citable-data page. All in sitemap.
- **D4 ✅ 2026-07-02** — Email system: (a) per-state "Landlord Law Cheat Sheet" lead magnets on every /laws hub (PDF generated client-side from verified fields — zero server cost, source `cheatsheet:<state>`); (b) exit-intent capture site-wide on content pages (desktop, 30-day suppression, permanent after signup, `exit_intent_shown` event); (c) growth/email-sequences.md — 5-email welcome sequence + 6 monthly newsletter templates, ESP-ready (blocked on Resend setup, a Jake task); capture instrumented per-source in GA4.
- **D5 ✅ 2026-07-02** — Distribution armory: outreach CRM (27 verified-active targets, tiered, no invented contacts), 30-question forum answer bank w/ per-community rules, 36 social drafts (12 wks, verified facts only), HARO playbook + 5 templates, PH hour-by-hour + timing rec (~3–4 wks out), directories ranked. Inventory: growth/assets-inventory.md.
- D6–D7 — pending (see tasks).

## Decisions

- 2026-07-02: Do NOT fabricate breadth. Unverified states stay unpublished with confidence flags. 300 excellent > 500 mediocre (per sprint charter + CLAUDE.md).
- 2026-07-02: Comparison pages deferred below eviction dataset in priority (higher thinness risk).

## Asset inventory: `growth/assets-inventory.md` · Outreach CRM: `growth/outreach-crm.md` · Experiments: `growth/experiments.md`
