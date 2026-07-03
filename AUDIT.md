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

## A4 — Security & abuse review

| # | Sev | Finding | Evidence | Status |
|---|---|---|---|---|
| A4-1 | INFO (pass) | **Service-role key never ships to the client** — 0 matches in the full JS bundle; env.ts keeps it server-only | grep /tmp/alljs | Pass (the critical one) |
| A4-2 | INFO (pass) | Every paid/data endpoint enforces Pro + ownership **server-side** via getProStatus: lease-extract, profile, compliance-profile, compliance-feed all 403 non-Pro; admin dashboard 404s non-admin (server component, session email match) | source review | Pass |
| A4-3 | INFO (pass) | Stripe webhook verifies the signature against the raw body before trusting any event (constructEvent + secret) | webhook route | Pass |
| A4-4 | LOW | **Watermark-free PDFs + batch generation are client-side entitlements** — a technical user can flip `isPro` in the browser and remove the footer / batch-generate. Inherent to zero-server-cost client generation | BatchRentReceiptTool passes `pro:true`; pdf footer is `pro:isPro` | **Accepted-risk** — the watermark is a soft upsell, not a hard gate; the real paid value (cloud save, lease AI, reminders) is all server-enforced (A4-2). Documented, not "fixed" by pretending |
| A4-5 | MEDIUM | **RLS correct by design but unconfirmed in prod** — schema.sql grants owner-only policies on profiles/landlord/compliance and RLS-with-no-policy (deny-all) on subscribers/lease_extractions. But A3-1 shows schema.sql wasn't fully run, so the prod RLS state of the newer tables is UNKNOWN | schema.sql review + A3-1 | **Jake-action:** after running schema.sql, in Supabase → Auth → Policies confirm RLS is ON for profiles, landlord_profiles, compliance_profiles, subscribers, lease_extractions |
| A4-6 | LOW | /api/subscribe has no rate limit — spammable | route review | Accepted-risk — email upsert dedupes; worst case junk rows; add a limit if abused (Vercel WAF/Upstash noted in RISK-REGISTER) |
| A4-7 | MEDIUM | Privacy policy said "cookieless analytics… no personal information" but the site runs GA4 (cookies, anonymized IP) — inaccurate disclosure | privacy page vs SiteHeader GA4 | **Fixed** — privacy page now accurately describes GA4, IP anonymization, that inputs never leave the browser, and how to opt out |
| A4-8 | INFO | No secrets in git history (the `sk_live` hit in f034664 is prose in the commit body, not a key); `npm audit` = 2 moderate, both transitive postcss-in-next build-time (not runtime-exploitable) | git log -S, npm audit | Pass / accepted-risk |
| A4-9 | LOW | Email unsubscribe: capture copy promises "unsubscribe anytime" but no ESP/unsubscribe mechanism exists yet (no email is sent yet) | copy vs infra | Deferred — becomes required the moment Resend goes live (List-Unsubscribe header + link); noted in email-sequences.md + RISK-REGISTER |

## A5 — Load & launch readiness

| # | Sev | Finding | Evidence | Status |
|---|---|---|---|---|
| A5-1 | MEDIUM | **Per-page OG cards were generic** — every shared link (incl. the reports Jake will promote) showed the homepage title/description because layout hardcoded og:title/description | live meta scrape | **Fixed** — removed static og title/desc from layout so each page's own title/description flows to its card; verified reports + hubs now render distinct cards |
| A5-2 | MEDIUM | **landlordkit.vercel.app serves a fully-indexable duplicate** of the whole site (200, robots Allow: /) | curl | **Mitigated + Jake-action** — canonical tags on every page already point Google to getlandlordkit.com (primary SEO defense, confirmed present). Permanent fix: redirect the vercel.app domain to the apex in Vercel settings (in runbook) |
| A5-3 | INFO (pass) | **Free-tool isolation holds** — every calculator/PDF runs entirely client-side with no server call; only auth/accounts/email-capture touch Supabase. If Supabase falls over, the core site stays up. This is the single most important launch-resilience property and it's real | architecture review (tools import no server actions; PDFs generated in-browser) | Pass |
| A5-4 | INFO (pass) | OG image renders (200 image/png); canonicals present on all key pages; robots + sitemap clean | curl | Pass |
| A5-5 | LOW | Homepage has no explicit canonical tag (self-canonicalizes) | curl | Accepted-risk |
| A5-6 | INFO | Full Lighthouse/CWV under throttled mobile not runnable from here (no headless browser); pages are static/SSG with minimal JS and the prior sprint verified Lighthouse 95+ mobile — re-run in PageSpeed Insights on the 8 entry pages pre-launch (in runbook) | — | Jake-action (light) |

Deliverable: **LAUNCH-DAY-RUNBOOK.md** — pre-flight checklist, break/fix table
in likelihood order, launch-day don'ts, and the standing Jake-actions.
