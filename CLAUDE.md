@AGENTS.md

# LandlordKit — project context for agent sessions

## What this is
Free, statute-cited legal/financial tools for **independent US landlords**
(the ~10M Americans owning 1–10 units). Live at **https://getlandlordkit.com**
(repo: github.com/jsabbah3/landlordkit, auto-deploys to Vercel on push to main).

**Business model:** all tools free forever, no signup, no paywalls. Monetized by
**Pro ($12/mo or $99/yr)**: saved landlord/property details, batch document
generation, watermark-free branded PDFs, portfolio dashboard. Display ads only
much later (~20k sessions/mo). Operating budget hard cap: **<$20/month**.
Revenue target: $1k/mo ≈ 80 Pro subs ≈ 3–8k engaged visitors/mo at 1–3% conversion.

**Differentiation (why we win):** competitors (RentLateFee.com, generic template
sites) are uncited, incomplete, or wrong. Our wedge: every state rule cites its
statute with a last-verified date + confidence flag, math models real statutory
nuance (holding periods, exemption thresholds, notice tiers), and outputs are
polished PDFs generated client-side.

## Tech stack & architecture
- **Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 + TypeScript.**
  ⚠️ Next 16 has breaking changes vs training data — read
  `node_modules/next/dist/docs/` before writing framework code (see AGENTS.md).
  Params are async (`await params`); middleware is now `proxy`; we avoid it.
- **All tool logic runs client-side** (zero server compute). PDFs via `pdf-lib`
  (`src/lib/pdf/pdfDoc.ts`). Pages are SSG (`generateStaticParams`), ~237 routes.
- **Supabase** (magic-link auth + `profiles`/`subscribers` tables, RLS) and
  **Stripe** (Checkout/Portal/webhook) are fully built but **env-gated**: with no
  keys the site builds and free tools work untouched. Server-side auth goes
  through same-origin proxies (`/api/auth/otp`, `/api/subscribe`) so ad blockers
  and network filters can't break signup.
- **Analytics:** `src/lib/analytics.ts` `track()` fans out to GA4
  (`NEXT_PUBLIC_GA_ID`) and/or Plausible (`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`).
  Events: tool_used, pdf_downloaded, result_shared, email_signup,
  upgrade_prompt_shown/clicked.

## Where things live
| Path | What |
|---|---|
| `src/tools/<tool>/data.ts` | **The legal database.** One reviewable file per topic; every entry has `cite: {statute, statuteUrl, lastVerified, confidence}` |
| `src/tools/<tool>/calc.ts` / `logic.ts` + `*.test.ts` | Pure calculation logic + vitest tests (42 passing; all money/legal math MUST be tested) |
| `src/tools/<tool>/content.ts` | Per-state FAQ/summary/worked-example builders for SEO pages |
| `src/app/tools/<slug>/page.tsx` + `[state]/page.tsx` | Tool landing + programmatic state pages |
| `src/components/tools/*.tsx` | Client tool UIs (8) |
| `src/components/ui/` | Shared UI kit (Button, Card, Field, Callout, Prose…) |
| `src/lib/` | Site config, SEO/JSON-LD helpers, states list, PDF builder, supabase/stripe clients, pro status |
| `src/lib/tools.ts` | Tool registry — drives homepage, footer, sitemap |
| `src/content/guides.ts` | Content hub (10 published guides; add sections + `published: true`) |
| `src/content/taxChecklist.ts` | Lead-magnet PDF content |
| `/data/legal/<state>.json` + `db.json` + `index.json` | **Unified legal DB** (all 9 categories, per-field provenance) — generated, consumable JSON |
| `src/lib/legal-db.ts` | Loader + types for the unified DB |
| `scripts/build-legal-db.ts` | `npm run build:legal` — generates `/data/legal/` from the canonical per-topic TS datasets, emits `LEGAL-REVIEW.md` |
| `gtm/` | Ready-to-post distribution assets (Reddit, outreach, articles, PH kit, directories); tables regenerate via `node scripts/gtm-tables.mjs` |
| `scripts/legal-audit.ts` | `npm run legal-audit` → `LEGAL-REVIEW.md` checklist grouped by confidence |
| `supabase/schema.sql` | profiles + subscribers tables (paste into Supabase SQL editor) |
| `DEPLOY.md`, `launch-checklist.md`, `BUSINESS.md` | Founder ops docs |

## Growth strategy
**Programmatic SEO + free-tool virality.** ~204 state pages target
`[rule] + [state]` long-tail queries; every free PDF carries a "Made with
LandlordKit" footer (Pro removes it); shareable result URLs encode inputs in
query params. Guides feed tools via internal links; `gtm/articles/` are
backlink-bait data studies. GSC verified, sitemap (229 URLs) submitted.
**Never promote a tool until its legal data is high-confidence** (currently
promotable: deposit interest, late fee).

## Founder constraints — design everything around these
- **Jake is a new dad with a full-time job: 4–8 hrs/week, often less.** Work
  autonomously, batch questions at the end, verify your own output
  (build + lint + `npm test` + preview), ship complete work.
- Near-zero budget. No new paid services without asking.
- Jake handles: accounts/keys (pasted into Vercel env — **never into chat**;
  he has pasted live keys into chat before — warn, never echo back), legal
  sign-off before promotion, and community posting (humans only).

## Non-negotiable conventions
1. **Every legal claim cites a statute** with `statuteUrl` where available,
   `lastVerified` date, and honest `confidence` (high/medium/low). Never state
   a legal value you haven't verified. Run `npm run legal-audit` after touching
   any `data.ts`.
2. **No thin pages.** Each state page needs genuinely state-specific content
   (YMYL territory — accuracy > volume). Don't generate 50 pages when only 12
   states have a real rule; enrich no-rule pages with cross-tool data instead.
3. **Every tool output includes the LandlordKit footer link** (built into
   `pdfDoc.ts`; `pro: true` removes it — that IS the upsell).
4. **Soft Pro upsell after value delivery** (`UpgradeNudge` after a document is
   generated). **Never a paywall in front of a free tool.**
5. "Not legal advice" disclaimer (`LegalDisclaimer`) on every legal surface.
6. Env vars are coerced/normalized defensively (site URL, Supabase URL, GSC
   token) — a mis-pasted value must never break the build. Keep that pattern.
7. Quality gates before pushing: `npm run lint`, `npm test`, `npm run build`
   all green. Lighthouse target 95+ mobile. Pushing to main deploys production.

## Unified legal database (`/data/legal/`)
The canonical legal data lives in the per-topic `src/tools/*/data.ts` modules
(typed, tested, verified). `npm run build:legal` consolidates them into a
portable **unified DB** at `/data/legal/` covering all 9 categories with
per-field provenance (`value, statute, statuteUrl, lastVerified, confidence,
sources[]`), and emits `LEGAL-REVIEW.md` (the spot-check checklist).
**Architecture choice:** TS-canonical → JSON-generated (one source of truth, no
divergence). The working tools/pages still read their per-topic module directly
— deliberately NOT repointed at JSON, to avoid breaking 200 verified pages for a
storage-format change. `src/lib/legal-db.ts` is the loader for a future
state-law hub once coverage is high enough (don't publish unverified fields).

**Coverage (honest):** 46/561 fields high-confidence. Verified categories:
deposit interest (14 high), late-fee cap (16 high), deposit max limit (10 high,
cross-checked vs Nolo/FindLaw/etc.). Deposit return + rent-increase notice are
mostly low/medium (migrated, not deeply verified). **5 categories entirely
unverified — never fabricated:** entry notice, termination notice, required
disclosures, habitability, rent-receipt rules. Fill via 2-source research
(~N states/session); never mark `high` without checking the statute.

## Hostile QA pass (2026-06-15) — see `gtm/qa-report.md`
Crawled tools/pages, fuzzed forms, checked links/schema/analytics/mobile.
**Fixed (critical):** client-side PDF generation crashed on non-Latin
characters (CJK/Cyrillic/emoji) — `WinAnsi cannot encode` — a silent failure
across all 5 document tools. `pdfDoc.ts` now sanitizes unencodable chars to `?`
and hard-breaks over-long tokens; regression test in `pdfDoc.test.ts` (48 tests
total). Passed: internal links, finance-calc edge cases (no div-by-zero), mobile
overflow, schema validity, analytics (`pdf_downloaded` confirmed firing).
Open/minor: live-compute tools (prorated, cash flow) don't emit `tool_used`;
download handlers lack try/catch user feedback (encoding crash already removed).

## Current state (last updated: 2026-06-15)
**Live & verified:**
- 8 tools live, all client-side: deposit interest, rent increase notice, late
  fee, deposit return tracker, lease renewal, rent receipt, prorated rent,
  cash flow. ~237 routes / ~204 programmatic state pages.
- Domain getlandlordkit.com (bought via Vercel); HTTPS; canonicals/sitemap/
  robots/OG correct. GSC verified, sitemap submitted. Lighthouse 95+ mobile.
- Legal data verified high-confidence: **deposit interest** (14/15 states; NM
  left medium — genuine statutory ambiguity about full-deposit vs. excess) and
  **late fee** (all 16 numeric-cap states). Rent-increase + deposit-return
  still carry low-confidence entries — verify before promoting those tools.
- Mobile UX done: hamburger nav, stacked date inputs, zero horizontal overflow.
- 10 guides published; email capture + Tax Prep Checklist lead magnet on
  homepage and all guides (verified end-to-end in preview).
- GA4 support, site-wide OG image, HowTo JSON-LD on flagship tools, full
  `/gtm` asset library (this session's growth sprint).

**Pending (blocked on Jake):**
- Run updated `supabase/schema.sql` (adds `subscribers`); set `NEXT_PUBLIC_GA_ID`.
- Confirm magic-link click-through once (Supabase email rate limit reset).
- Stripe test-mode (products + 4 env vars + webhook) and Resend SMTP
  (`DEPLOY.md` §5–7) — required before any Pro subscriber can exist.
- Open decisions: lease-template tool? rent-receipt state pages (~12 states
  with real statutes)? Product Hunt timing (recommended: after Stripe works).

**Known gotchas:** Supabase free email ≈ 2–4/hr (testing only — Resend SMTP
before real Pro launch). Supabase dashboard shows the API URL with a
`/rest/v1/` suffix — env wants the bare origin (code normalizes it anyway).
GSC env accepts token or full meta tag. `scripts/` is excluded from tsconfig
(runs via Node type-stripping). Old domain landlordkit.vercel.app still serves;
canonical is getlandlordkit.com. PDFs use pdf-lib standard fonts (WinAnsi only)
— non-Latin names render as `?`; full Unicode would need an embedded font
(multi-MB for CJK) — open product decision. Analytics events fire via `track()`
but reach no provider until `NEXT_PUBLIC_GA_ID`/`NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is
set.
