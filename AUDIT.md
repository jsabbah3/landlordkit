# AUDIT.md — red-team audit findings (2026-07-02)

Severity: **Critical** (live harm/legal exposure) · **High** (wrong public claim or exploitable) ·
**Medium** (misleading/degraded) · **Low** (polish). Status: fixed / deferred / accepted-risk.

## A1 — Legal data verification

### Findings

| # | Sev | Finding | Evidence | Status |
|---|---|---|---|---|
| A1-1 | **HIGH** | **WA rent-increase notice was wrong: site said 60 days; law is 90 days for ANY increase since 5/7/2025** (HB 1217, RCW 59.18.140(3)) | WA Dept. of Commerce HB 1217 resource center; AG flyer; statute page | **Fixed** — 90 days, high confidence, cap + notice-form note |
| A1-2 | **HIGH** | **CO rent-increase notice was wrong: site said 30 days; C.R.S. § 38-12-701 requires 60 days** (no-written-agreement tenancies) + anti-circumvention rule | Statute text (colorado.public.law / Justia) | **Fixed** — 60 days, high confidence, scope note |
| A1-3 | MEDIUM | IL deposit-interest summary lacked the **Chicago RLTO exception** (applies to most Chicago rentals regardless of the state 25-unit threshold; own annual rate 0.01% for 2026 + required lease addendum) | chicago.gov + IDFPR 2026 announcements | **Fixed** — Chicago callout in IL summary; cite now includes RLTO § 5-12-080 |
| A1-4 | MEDIUM | Table renderers compressed formula-based interest rates to "~1.5%": **MD's actual rate is the greater of 1.5% or the 1-yr Treasury yield** (currently well above 1.5%); **DC resets semi-annually** | MD DHCD calculator page; DCMR 14-311 | **Fixed** — `rateLabel` field; guide tables, gtm tables, and the report chart now render formulas honestly (formula states excluded from the bar chart) |
| A1-5 | LOW | IL 2026 rate stated "about 0.01% APY"; official figure is 0.005% (0.01% APY) | IDFPR 2026 announcement | **Fixed** — exact wording |
| A1-6 | INFO | CT 2026 deposit index **0.49% confirmed exactly right** against the official CT DOB announcement | portal.ct.gov | Verified, date bumped |
| A1-7 | INFO | WA deposit return 30 days **confirmed by statute text** (+ forfeiture/2x penalty nuance added) | RCW 59.18.280 | Verified, medium→high |

### What was verified vs not (honest coverage)

- **Fully re-verified against primary sources this pass:** WA (notice, return), CO (notice), CT/IL/MD/DC (interest incl. 2026 rates), Chicago RLTO. FL/TX/VA/OH/OR/MO/RI/VT/SD/MT/AK/MI/IL termination values were statute-verified 0 days ago (D2b sprint).
- **Priority-state claims reviewed against statutes surfaced in research + checked for known recent legislation:** CA (AB 12 small-landlord carve-out present ✓; §827 30/90 tiers present ✓; AB 1482 note present ✓), NY (HSTPA 14-day return, $50/5% late fee, 226-c tiers, 7-103 6+ units — all present ✓), MA, NJ, PA, OH, TX, FL — no discrepancies found; verification dates NOT bumped on these because the statute text was not re-fetched line-by-line this pass.
- **Not re-verified:** the ~28 `std()` 30-day rent-increase entries at low confidence and low-confidence deposit-return entries for small states. These display "low confidence — verify" badges site-wide and are EXCLUDED from hubs/reports/index by the high/medium filter. Accepted-risk with monitoring (staleness script + §6 recipe).

### Per-state confidence table (displayed values only)

| State | Verdict | Notes |
|---|---|---|
| CA, NY, TX, FL, MA, OH, PA, NJ | **Good** | Recent-legislation checks clean; tiers/carve-outs present |
| IL | **Good (fixed)** | Chicago callout added |
| WA | **Fixed** | Was materially wrong pre-audit (60→90) |
| CO | **Fixed** | Was materially wrong pre-audit (30→60) |
| CT, MD, DC, ND | **Good (fixed rendering)** | Annual/formula rates verified for 2026 |
| VT, RI, SD, MT, AK, MI, MO, VA, OR | **Good** | Statute-verified within 30 days |
| Remaining ~25 low-confidence states | **Flagged on-site** | Low-confidence badges shown; excluded from hubs/reports |

### Jake personal spot-check shortlist
1. **WA** — the 90-day fix + HB 1217 note (biggest change; read the tool page once).
2. **CO** — the 60-day fix + its scope note.
3. **MD** — confirm the DHCD-calculator framing reads right to you.
4. **CA** — highest traffic potential; skim /laws/california for anything that reads off.
5. **NY** — read the interest rule (6+ units / 1% admin fee) on the hub.

## A2 — Content quality (Google-rater pass)

Method: template-level analysis (masked-text similarity + content inspection)
across every page type, which covers all pages sharing a template — stronger
than eyeballing 40 individual pages.

| # | Sev | Finding | Evidence | Status |
|---|---|---|---|---|
| A2-1 | **HIGH** | 83 low-confidence tool state pages were 99.0% identical (state name masked, ~3.1k chars) AND asserted unverified values in their `<title>` ("(30-Day Rule)") — the exact failure mode that made WA/CO wrong, at index scale | AL vs KS masked-diff 99.0%; confidence counts: rent-increase 35 low, late-fee 33 low, deposit-return 15 low | **Fixed** — low-confidence state pages are now `noindex,follow`, removed from sitemap (267→184 URLs), and low-confidence titles no longer assert the number. Pages remain usable with their low-confidence badge; they re-enter the index automatically when research upgrades them (OPERATIONS §6) |
| A2-2 | INFO | /laws hubs are genuinely differentiated (MA vs VT masked similarity 25.6%) — driven by real per-state field/value differences + honest unverified lists | measured | Pass |
| A2-3 | INFO | Deposit-interest "no requirement" states have substantive negative-case content + working calculator (TX sampled) | inspected | Pass |
| A2-4 | LOW | Noindexed low-confidence pages still assert the value in body copy (hedged only by the confidence badge) | AL summary line | Accepted-risk — search exposure removed; full fix = hedged summaries in content builders (logged for a research week) |
| A2-5 | INFO | Guide/report FAQ + table content is hand-written or generated from verified data; FAQ schema answers match on-page content by construction | construction + samples | Pass |

**Judgment call for Jake:** indexed pages dropped 267→184 by design. The 83
removed were unverified 99%-duplicate shells — liability, not asset. They come
back one by one as §6 research verifies them, each with a statute-checked
title. This trades raw page count for the accuracy moat.

## A3 — Funnel & trust teardown

| # | Sev | Finding | Evidence | Status |
|---|---|---|---|---|
| A3-1 | **HIGH** | **Email capture broken in production**: /api/subscribe returns 500 for valid emails. Service key works (Stripe webhook writes `profiles`), so the `subscribers` table/constraint is missing in prod — schema.sql §subscribers was never run | live POST test | **Jake-action (URGENT): run supabase/schema.sql in the SQL editor** (also creates lease_extractions + feed_token, both pending). Code-side fixed: capture failure no longer blocks the promised PDF — the lead magnet downloads anyway with an honest note, invalid emails still validated |
| A3-2 | **HIGH** | 8-second trust test failed: no /about, no contact link anywhere (contact only buried on /press), no named human | curl live site | **Fixed** — /about page (who runs it, the verification rule, how it stays free, contact), "About & contact" footer link, sitemap entry |
| A3-3 | MEDIUM | Tenant persona lands on landlord-framed copy; the math serves them fine but nothing acknowledges them | copy review | Recommendation logged (one-line "Tenant? This same math shows what you're owed" on deposit tools) — deferred |
| A3-4 | LOW | Stripe portal cancel/renew untested end-to-end (live mode only; founder purchase verified checkout+webhook) | — | Jake-action: open /account → Manage billing once; cancel+resume in the portal |
| A3-5 | INFO | PDFs build clean: tax checklist + state cheat sheet generate multi-KB PDFs, no leaked placeholders, disclaimer + verification language present (now unit-tested, 77 tests) | new stateCheatSheet.test.ts | Pass |
| A3-6 | INFO | 404s correct (non-hub /laws/*, unknown routes); absurd-input handling covered by the earlier hostile-QA pass (WinAnsi crash fixed, div-by-zero guarded) | live curls + qa-report | Pass |
