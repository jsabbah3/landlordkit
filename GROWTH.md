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
- D3–D7 — pending (see tasks).

## Decisions

- 2026-07-02: Do NOT fabricate breadth. Unverified states stay unpublished with confidence flags. 300 excellent > 500 mediocre (per sprint charter + CLAUDE.md).
- 2026-07-02: Comparison pages deferred below eviction dataset in priority (higher thinness risk).

## Asset inventory: `growth/assets-inventory.md` · Outreach CRM: `growth/outreach-crm.md` · Experiments: `growth/experiments.md`
