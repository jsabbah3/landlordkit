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

These are hardened against the ways a less capable model tends to go wrong.
Paste the Guardrails block WITH every one of them.

**Weekly report interpretation:**
> Read growth/reports/week-<date>.md, gtm/metrics.md's latest row, and
> OPERATIONS.md §4. Output exactly: (1) ONE focus for this week's discretionary
> hours (not a list — pick the single highest-leverage one), (2) which §4 rule
> triggered it, (3) the exact first action, drawn ONLY from §2 / §6 /
> growth/experiments.md. Do not invent new strategy, channels, or tactics. If
> no §4 rule clearly triggers, say so and default to §6 research.

**State research session (HIGHEST RISK — this is the accuracy moat):**
> Verify <field> for <state> per OPERATIONS.md §6. Hard rules:
> - The SOURCE must be the state legislature's own site or an official state
>   agency page (a .gov / .us domain, or the state's official code site).
>   Nolo, iPropertyManagement, Stessa, Baselane, TurboTenant, Justia, and every
>   other aggregator/law-firm blog are FORBIDDEN as the source — you may use
>   them only to locate the citation, never as the basis for a value.
> - Paste the statute URL AND quote the operative sentence(s) to me BEFORE
>   editing any file. If you cannot find and quote the primary source, STOP and
>   tell me — do not fall back to an aggregator and do not guess.
> - Set confidence 'high' ONLY if you quoted primary-source text and included a
>   .gov/official statuteUrl; otherwise 'medium'. Never 'high' from a summary.
> - Edit only the single relevant src/tools/<topic>/data.ts entry. Then run the
>   §6 step-4 commands. If `build:legal` or `build` fails, STOP and report —
>   never loosen a type or delete a check to make it pass. Show me the diff
>   before committing.

**Outreach batch:**
> Draft personalized versions of the mapped template (gtm/outreach-emails.md)
> for growth/outreach-crm.md targets #<n..m>. Output PLAIN-TEXT DRAFTS ONLY.
> - Do NOT send, email, or use any send/email tool even if one is available —
>   the human operator sends these. If you think a step needs sending, stop.
> - Leave the recipient as a literal [CONTACT NAME] / [EMAIL] placeholder. Do
>   NOT guess, generate, or look up a person's name or email.
> - Every statistic must be one you can tie to a specific live getlandlordkit
>   .com URL (name the URL). If you can't, omit the stat — never embellish.

**Experiment execution:**
> Implement ONLY experiment #<n> from growth/experiments.md, exactly as
> specced — nothing more, no extra "improvements." If the spec is ambiguous,
> ASK before coding. First record the current baseline numbers in GROWTH.md.
> Then implement, and run lint + tests + build. If ANY of them fail, do NOT
> commit and do NOT weaken the test/lint/types to pass — report the failure.
> On success, commit and add a dated note in GROWTH.md to evaluate against the
> decision rule on <date +14d>.

**Guardrails for any model (paste with EVERY prompt above):**
> You have NO authority to post, send, submit, publish, email, tweet, comment,
> or create accounts anywhere external — even if a tool for it is available and
> even if asked. Those are the human operator's actions; if a task seems to
> need one, STOP and hand back. Never state or publish a legal value you
> haven't verified against the primary statute (aggregators don't count).
> Free tools stay free — never gate one. No new paid services or spend. Run
> lint + tests + build before any commit, and never weaken a check to make it
> pass. When unsure, ask rather than assume.

## §8 Jake-only setup still pending (unblocks marked assets)
1. **Run supabase/schema.sql — URGENT.** Email capture 500s in prod until you
   do (audit A3-1); also creates lease_extractions + feed_token. After running,
   confirm RLS is ON for all user tables (Supabase → Auth → Policies).
2. Redirect landlordkit.vercel.app → getlandlordkit.com (Vercel → Settings →
   Domains) to kill the duplicate-content copy (audit A5-2).
3. Resend (or ESP) → unlocks growth/email-sequences.md. **When you do, add a
   List-Unsubscribe header + a working unsubscribe link** — the capture copy
   already promises "unsubscribe anytime" (audit A4-9, CAN-SPAM).
4. Connectively/Qwoted/Featured accounts → unlocks HARO playbook.
5. Supabase Pro ($25/mo, needs decision) → custom auth domain before PH launch.

## §9 Monitoring (from the red-team audit — check these on the weekly loop)
Merged from RISK-REGISTER.md. Add to the §1 cadence:
- **Legal accuracy (top risk):** any user-reported wrong value → §4 "data error
  reported" rule (drop everything, verify vs statute, fix, reply). Monthly, run
  `node scripts/growth/staleness.mjs` and re-verify anything a legislative
  session may have changed (watch CA, NY, WA, CO, OR, FL — the fast-movers).
- **Silent auth/capture failure:** monthly, submit a test email on the homepage
  and confirm a row lands in `subscribers`. A 500 here loses launch leads
  silently.
- **Data drift:** annually in January, re-check the published-rate states
  (CT/MD/DC/IL/ND deposit interest) — those rates reset and going stale
  publishes a wrong number.
- **Duplicate content:** if `check-site.mjs` or GSC shows vercel.app URLs
  indexed, action §8.2.
