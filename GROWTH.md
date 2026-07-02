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
- D2 — in progress. Strategy: (1) 51 state law HUB pages assembled from already-verified data (no new legal claims); (2) NEW eviction/termination-notice dataset, web-verified in priority order (most-populous states first, 2-source rule); publish only verified states; (3) rent-receipt state pages for the ~dozen states with real statutes. Target: maximize substantive pages; est. 350–420 total. 500+ only if verification keeps pace — quality gate wins per hard constraint.
- D3–D7 — pending (see tasks).

## Decisions

- 2026-07-02: Do NOT fabricate breadth. Unverified states stay unpublished with confidence flags. 300 excellent > 500 mediocre (per sprint charter + CLAUDE.md).
- 2026-07-02: Comparison pages deferred below eviction dataset in priority (higher thinness risk).

## Asset inventory: `growth/assets-inventory.md` · Outreach CRM: `growth/outreach-crm.md` · Experiments: `growth/experiments.md`
