# GTM-AUG-2026 — the four-week go-to-market sprint

**Window:** Mon 2026-08-03 → Sun 2026-08-30
**Capacity:** 5–8 hrs/week of Jake's time (full-time job at Gartner). Budget the
sprint at **26 hours total**: ~20 to LandlordKit, ~6 to Crush.
**Definition of success on Aug 30:** organic traffic and the email list are
compounding week over week. Not revenue. Not a launch moment.
**Channels Jake will personally front:** Reddit / BiggerPockets / landlord
forums, and HARO / press. *Not* LinkedIn, *not* cold email.

Weekly ops manual remains `OPERATIONS.md`. Sprint history remains `GROWTH.md`.
This file is the August plan only.

---

## The one-line strategy

Fix the email leak, then spend every remaining hour on the two things only Jake
can do — answering real questions in landlord communities, and pitching
journalists — while agent time goes to verifying state law data, which mints new
indexable pages automatically.

## Allocation principle

Jake's hours are the scarce resource, so they buy only what *cannot* be
delegated: forum presence under a real account, HARO pitches, judgment calls,
and review. Research, drafting, data verification and scripts run as agent work
and cost Jake review time only. Every line item below carries its hour price;
the week totals are a cap, not a target.

---

## Corrections to stale docs (found 2026-08-03)

| Doc | Says | Actually |
|---|---|---|
| `BUSINESS.md` | "Guides: 2 published, 8 scaffolded" | **11 guides, all `published: true`.** The guide backlog is finished. |
| `launch-checklist.md` | "publish one guide/week" | No stubs remain. Those ~4 hrs are reallocated to state verification + near-win pages. |

Update `BUSINESS.md` at the Week 4 readout.

---

## Week 1 (Aug 3–9) — Stop the leak

**Jake: 5.0 hrs**

| # | Task | Hrs | Note |
|---|---|---|---|
| 1 | **Run `supabase/schema.sql` in prod. Then submit a real test signup and confirm the row lands in `subscribers`.** | 1.0 | **The gate on the entire sprint.** Email capture 500s in production today. The PDF still downloads, so nothing looks broken — you would collect zero leads through any traffic spike. `RISK-REGISTER.md` #2. |
| 2 | Confirm RLS is ON for `profiles`, `landlord_profiles`, `compliance_profiles`, `subscribers`, `lease_extractions` (Supabase → Auth → Policies) | — | Included in #1. `RISK-REGISTER.md` #3. Two minutes once schema.sql has run. |
| 3 | Bing Webmaster Tools: import from GSC | 0.25 | Two clicks, free incremental traffic |
| 4 | GSC URL Inspection → request indexing on 5 best pages | 0.25 | deposit-interest + late-fee landings, and CA / MA / NY state pages |
| 5 | Warm the accounts: r/Landlord, r/RealEstateInvesting, BiggerPockets. Comment helpfully. **Zero links.** | 1.5 | You need comment history before Week 2 or you read as a drive-by promo account and get removed |
| 6 | Sign up HARO / Qwoted / Featured; alerts on "rent," "landlord," "security deposit," "tenant" | 0.5 | |
| 7 | **Record the baseline** — GSC clicks / impressions / indexed pages, subscriber count, and the current position of the 10 target queries | 0.5 | Without this, Week 4 has nothing to compare against |
| 8 | Review the state-verification batch (agent-prepared) | 1.0 | Spot-check citations, approve the confidence upgrades |

**Agent track (no Jake hours):** verify state law data against primary statutes,
batch 1. Target the states closest to the `/laws` publish threshold.

---

## Week 2 (Aug 10–16) — The engine starts

**Jake: 5.0 hrs**

| # | Task | Hrs | Note |
|---|---|---|---|
| 1 | **Forum answering — 20 min/day × 5 days.** Find 2–3 real questions where a tool is the literal answer. Answer *fully in the comment*; link the specific state page as a citation. | 1.7 | The single highest-yield activity in this plan. Answer bank: `growth/forum-answer-bank.md` (30 questions, per-community rules already written) |
| 2 | 2 HARO pitches using verified stats | 0.75 | `growth/haro-playbook.md` + 5 templates. One pickup on a finance site is a backlink worth months of forum work |
| 3 | One genuine value post to r/Landlord, one to BiggerPockets | 1.0 | Resources, not pitches. Appendix A2 |
| 4 | Weekly dashboard: `node scripts/growth/weekly-report.mjs` | 0.5 | |
| 5 | Review state-verification batch 2 | 1.0 | |

### ⚠ Promotion gate — do not break this

**Promote only Security Deposit Interest and Late Fee.** Those are the two
datasets verified to `high` confidence (14/15 states and all numeric-cap states
respectively). Everything else stays unpromoted until its data is verified.

`RISK-REGISTER.md` #1 is correct that one wrong number caught by a journalist is
brand-ending, and the audit already found two live errors (WA, CO) that had been
public for weeks. The whole positioning is "we're the accurate one." Do not
point a HARO pitch or a forum answer at a `low`-confidence dataset.

---

## Week 3 (Aug 17–23) — Compound

**Jake: 5.5 hrs**

| # | Task | Hrs |
|---|---|---|
| 1 | Forum answering — 20 min/day × 5 | 1.7 |
| 2 | 2 HARO pitches | 0.75 |
| 3 | Weekly dashboard + `staleness.mjs` | 0.5 |
| 4 | Review state-verification batches 3–4 | 2.0 |
| 5 | Check that newly-verified states auto-published to `/laws`; confirm sitemap grew | 0.5 |

**Why verification is the best use of the freed guide hours:** the `/laws` hub
system publishes a state automatically once it has **≥4 verified fields** — no
code change, just data. So verification research simultaneously (a) creates new
indexable pages, (b) deepens existing ones, and (c) retires the #1 entry in the
risk register. Nothing else in the backlog does all three.

---

## Week 4 (Aug 24–30) — Read the data, then decide

**Jake: 5.0 hrs**

| # | Task | Hrs |
|---|---|---|
| 1 | Forum answering — 20 min/day × 5 | 1.7 |
| 2 | **Near-win sweep.** Pull every query sitting at GSC position 5–15; strengthen those exact pages with an FAQ entry, a worked example, and an internal link. | 1.5 |
| 3 | Review final verification batch | 1.0 |
| 4 | **4-week readout.** Update `BUSINESS.md` metrics + the stale guide line. Judge against the kill criteria below. | 0.8 |

The near-win sweep is the fastest available click gain: a page at position 8
needs a nudge, not a rewrite, and you already rank.

---

## Deferred, with reasons

| Item | Decision | Why |
|---|---|---|
| **Product Hunt** | **Push to mid-September** | ~6 hrs of a 26-hr budget for a one-day spike and a backlink. It does not produce compounding traffic, which is the stated success condition. Launch it once this sprint has produced something to point at. Runbook is already written (`gtm/product-hunt.md`) and does not expire. |
| **Pro billing / conversion work** | Deferred | Stripe is live but there is no traffic to convert yet. Revisit at the month-4 checkpoint in `OPERATIONS.md`. |
| **Display ads** | Deferred | Gate is 20k+ sessions/mo per `BUSINESS.md`. Nowhere close. |
| **Comparison pages** | Still deferred | Thinness risk, per the 2026-07-02 decision. Unchanged. |

---

## Weekly metrics (record every Sunday)

| Metric | Baseline (Aug 3) | W1 | W2 | W3 | W4 |
|---|---|---|---|---|---|
| GSC clicks (7d) | | | | | |
| GSC impressions (7d) | | | | | |
| Indexed pages | | | | | |
| Sitemap URLs | | | | | |
| **Email subscribers (net new)** | | | | | |
| Target queries in position 5–15 | | | | | |
| Backlinks earned | | | | | |
| High-confidence state fields | | | | | |

---

## Kill criteria — judge on 2026-08-30, not before

**Continue LandlordKit if:** email subscribers are net-positive week over week
**and** GSC clicks are meaningfully above the Aug 3 baseline.

**Hard signal to respect:** if email capture is confirmed working and you still
get near-zero signups after four weeks of genuine forum presence, the problem is
**the offer, not the traffic** — and the next sprint is about what you're asking
people to sign up for, not about getting more people to the page.

**Do not judge SEO on four weeks.** Indexing and ranking lag 4–12 weeks. The
state pages published in Week 3 cash in October. What you *can* judge in four
weeks: whether the email path works, whether forum answering converts to
clicks, and whether HARO produces a single pickup.

---

## Related

Crush's parallel track is deliberately *not* a GTM sprint — see
`~/Crush/GTM-AUG-2026.md`. It is a data-pipeline repair, it consumes ~6 hrs of
Jake's time as review only, and it is not expected to show user growth inside
this window.
