# OPERATIONS.md — the weekly growth operating manual

Written for an operator with zero context (future Jake, or any AI model).
The system was built in the July 2026 sprint (see GROWTH.md + SPRINT-RETRO.md).
Your job is NOT to think up strategy — it's to execute this loop and let the
numbers steer. Total time: 4–8 hrs/week.

**Prime directives (never violate):**
1. Never publish a legal value that isn't verified against the statute (2
   sources, citation, date). Unverified = displayed as unverified.
2. All external posting/sending/submitting is done by Jake as himself. AI
   drafts; Jake ships. No personas, no fake engagement.
3. Free tools stay free. No paywalls in front of them.
4. New spend: $0 without Jake's explicit decision.

---

## §1 The weekly cadence (pick a fixed day; ~half the budget, rest goes to §5)

| Step | Time | What |
|---|---|---|
| 1 | 10 min | Export GSC (Performance → last 7 days → Export CSV) into `growth/gsc/YYYY-MM-DD/`. Run `node scripts/growth/weekly-report.mjs`. Read the flags. |
| 2 | 5 min | `node scripts/growth/check-site.mjs --fast` (monthly: run without `--fast`). Any FAIL → fix before anything else. |
| 3 | 5 min | `node scripts/growth/staleness.mjs`. Stale fields → add to §6 research list. |
| 4 | 10 min | Fill the weekly row in `gtm/metrics.md` (GA4 numbers + Stripe subs + /admin/growth counts). |
| 5 | 10 min | Read §4 decision rules against this week's numbers → pick ONE focus for the discretionary hours. |
| 6 | 2–4 hrs | Execute the focus (distribution §2, research §6, or the current experiment from growth/experiments.md). |
| 7 | 5 min | Log what shipped + next week's intent in GROWTH.md sprint log. |

## §2 Distribution rhythm (Jake-only actions, drafts all pre-made)

- **Daily-ish (15 min):** 2–3 forum/Reddit answers from `growth/forum-answer-bank.md`
  (rules at the top of that file — read them once a month; r/Landlord bans AI
  text and tool promotion). ≤1 link per 3–5 answers.
- **Weekly:** 3–5 outreach emails from `growth/outreach-crm.md` (log every
  send). 1 social post ×3 from `growth/social-posts.md` (week N = posts 3N-2..3N).
- **Weekly:** 1–2 directory submissions from `gtm/directories.md` priority list
  until exhausted.
- **If HARO accounts exist:** scan alerts 2×/week, answer ≤3 (growth/haro-playbook.md).
- **Product Hunt:** launch once, using gtm/product-hunt.md, only after its
  timing gate passes (2 wks GA4 baseline + 1 testimonial + 50 subscribers).

## §3 Reading the dashboards

- **GA4** (funnel): `tool_used` (activation), `email_signup` (by source),
  `upgrade_prompt_shown → upgrade_clicked → checkout_started → pro_subscribed`.
  Ratios and what they mean: `gtm/metrics.md` §"How to read it".
- **GSC** (search): the weekly report file (growth/reports/) surfaces
  LOW-CTR / STRIKING-DISTANCE / DROP / LOST-QUERY flags with the action each
  implies.
- **/admin/growth** (app truth): subscribers, active Pro count, verified-data
  coverage, hub count. Stripe dashboard = revenue truth.

## §4 Decision rules (if X for N weeks → do Y)

- **Impressions flat 4 straight weeks** → diagnostic: (a) GSC → Indexing →
  Pages: are new URLs indexed? (b) full `check-site.mjs` run; (c) confirm
  sitemap URL count matches expectation (~267+); (d) if indexed but flat, the
  bottleneck is authority → shift ALL discretionary hours to outreach/backlinks
  for 3 weeks.
- **Impressions up, clicks flat** → titles/descriptions. Take the top-10
  LOW-CTR flags, rewrite metadata (question-form titles win in this niche).
- **Clicks up, `tool_used` flat** → wrong traffic or weak page match. Check
  which pages get clicks; strengthen the tool CTA above the fold there.
- **Activation up, signups flat** → run experiment #1 (state cheat-sheet on
  tool pages), then #4.
- **`upgrade_clicked` up, `checkout_started` flat** → walk the pricing page +
  sign-in flow yourself on mobile. Something broke.
- **`checkout_started` up, `pro_subscribed` flat** → Stripe dashboard → failed
  payments; check the checkout-success redirect still fires `pro_subscribed`.
- **A state page/query surges** → double down: verify 1–2 more fields for that
  state (§6), enrich its hub, point the next outreach email at it.
- **Reddit answer removed / modmail warning** → stop links in that sub for 30
  days; pure-value answers only. Never argue with mods.
- **A data error is reported** → drop everything, verify against the statute,
  fix the data file, `npm run build:legal`, `node scripts/gtm-tables.mjs`,
  commit, and reply to the reporter with the fix. Accuracy is the moat.

## §5 The month-4 viability checkpoint

Around week 16, judge the engine against these (from BUSINESS.md economics):
- **Green (keep going):** organic clicks growing ≥20%/mo compounding, ≥500
  email subscribers, ≥10 paying Pro subs, at least 5 referring domains earned.
- **Yellow:** growth positive but linear; <10 subs. → Cut lowest-ROI motions
  (check the send-log response rates), double the winner, re-check month 6.
- **Red (rethink):** clicks flat despite indexed pages + 20 outreach responses
  attempted + PH done. → The problem is positioning, not execution. Options:
  niche down to the 5 best-covered states, pivot the wedge (compliance
  calendar as the hero product), or hold as a maintenance-mode asset.

## §6 Research recipe: raising verified coverage (unlocks hubs + rankings)

The staleness script prints the states one field from a hub — do those first.
Per field (30–45 min each, any capable model can draft, Jake spot-checks):
1. Search the state legislature's own site for the statute (secondary
   aggregators only to FIND the citation, never as the value's source).
2. Confirm the current-version text (watch for recent amendments — FL's 2023
   HB 1417 is the cautionary tale; aggregators still have it wrong).
3. Add to the canonical dataset (`src/tools/<topic>/data.ts`) with statute,
   URL, today's date, `high` only if you read the statute text, else `medium`.
4. `npm run build:legal && node scripts/gtm-tables.mjs && npm run build` —
   hubs/tables/index update automatically. Commit.
Priority topics by SEO value: termination notice (38 states left) > entry
notice > rent-receipt rules (~12 states with real statutes) > disclosures.

## §7 Paste-prompts for running recurring tasks with any AI model

**Weekly report interpretation:**
> Read growth/reports/week-<date>.md, gtm/metrics.md's latest row, and
> OPERATIONS.md §4. Tell me: (1) the single highest-leverage focus for this
> week's 3 discretionary hours, (2) which §4 rule triggered it, (3) the exact
> first action. Do not propose new strategy; pick from §2/§6/experiments.

**State research session:**
> Follow OPERATIONS.md §6 exactly to verify <field> for <state>. You must find
> the statute on the state legislature's site and quote the operative text to
> me before editing any data file. Confidence 'high' only if you quoted the
> statute. Then run the §6 step-4 commands and show me the diff before commit.

**Outreach batch:**
> Open growth/outreach-crm.md. Draft personalized versions of the mapped
> template for targets #<n..m> using gtm/outreach-emails.md. I will find the
> contact emails and send them myself. Do not invent names, emails, or claims;
> every number must match the live site.

**Experiment execution:**
> Implement experiment #<n> from growth/experiments.md exactly as specced.
> Record the baseline numbers in GROWTH.md first, then implement, verify with
> lint+tests+build, and commit. Set a reminder note in GROWTH.md to evaluate
> against the decision rule on <date +14d>.

**Guardrails for any model (paste with every prompt above):**
> Constraints: never state a legal value you haven't verified against the
> statute; never post/send/submit anything externally; free tools stay free;
> no new spend; quality gates (lint, tests, build) before any commit.

## §8 Jake-only setup still pending (unblocks marked assets)
1. Resend (or ESP) → unlocks growth/email-sequences.md (welcome + newsletter).
2. Connectively/Qwoted/Featured accounts → unlocks HARO playbook.
3. Supabase Pro ($25/mo, needs decision) → custom auth domain before PH launch.
4. Re-run supabase/schema.sql if not yet done (lease_extractions + feed_token).
