# LandlordKit

Free, accurate, state-aware tools for small US landlords — monetized with a Pro
subscription and (later) display ads. Built for organic search growth: every
state-aware tool generates a static, substantive page per state.

> **Status:** Foundation + first 2 tools shipped (validation milestone). See
> [`BUSINESS.md`](./BUSINESS.md) for the model and [`launch-checklist.md`](./launch-checklist.md)
> for the go-live playbook.

## What's built

| Area | Status |
|---|---|
| Security Deposit Interest Calculator (state-aware, 12 rule states) | ✅ Live |
| Rent Increase Notice Generator (all 50 states + DC) | ✅ Live |
| Client-side PDF generation (free footer / Pro-removable) | ✅ |
| Programmatic SEO state pages (63 today) + sitemap, robots, JSON-LD | ✅ |
| Homepage, tool directory, pricing, 2 guides + 8 scaffolded, legal pages | ✅ |
| Tests for all calculation/legal logic | ✅ (16 passing) |
| Stripe / Supabase Pro flow | 🪝 Hooks in place; wire at launch (see DEPLOY.md) |
| Tools 3–8 (late fee, deposit return, lease renewal, receipt, prorate, cash flow) | 📋 Registered, not built |

## Stack

- **Next.js 16 (App Router) + React 19**, fully static (SSG). Zero server
  compute — every calculator and PDF runs in the browser, so hosting cost is
  flat regardless of traffic.
- **TypeScript**, strict.
- **Tailwind v4** design system (see `src/app/globals.css`).
- **pdf-lib** for client-side PDF documents.
- **Vitest** for logic tests.
- Deploy target: **Vercel free tier**. Accounts: **Supabase** (Pro only),
  **Stripe** (payments), **Resend** (transactional email), **Plausible/GA4**
  (analytics).

## Project structure

```
src/
  app/                      # routes (App Router)
    page.tsx                # homepage
    tools/                  # tool landing + [state] programmatic pages
    guides/                 # content hub + [slug]
    pricing/ privacy/ terms/ disclaimer/
    sitemap.ts  robots.ts   # SEO infra
  components/
    ui/                     # shared UI kit (Button, Card, Field, ...)
    tools/                  # the interactive client tools
    layout/                 # header + footer
  lib/                      # site config, states, seo, analytics, format, pdf
  tools/                    # SELF-CONTAINED tool modules:
    security-deposit-interest/   data.ts · calc.ts · calc.test.ts · content.ts
    rent-increase-notice/        data.ts · logic.ts · logic.test.ts · content.ts
  content/guides.ts         # cornerstone guides registry
```

**Each tool is a self-contained module** under `src/tools/<tool>/`: a reviewable
legal **data file**, pure **calculation logic**, **tests**, and **content**
(FAQ/example builders). UI primitives are shared from `src/components/ui`.

## The legal data files (review these before launch)

State rules live in single, reviewable files you can spot-check and update:

- `src/tools/security-deposit-interest/data.ts`
- `src/tools/rent-increase-notice/data.ts`

Every state entry carries a **statute citation**, a **`lastVerified` date**, and
a **`confidence` flag** (`high` / `medium` / `low`). Many entries are currently
`low`/`medium` — they were compiled from public legal summaries, **not** a
line-by-line read of each primary statute. **Do not launch the legal copy
without verifying each rule against its cited statute.** Low-confidence entries
are flagged in the UI with a "verify" badge.

## Commands

```bash
npm run dev      # local dev (http://localhost:3000)
npm run build    # production build + static generation
npm run start    # serve the production build
npm test         # run the Vitest suite
npm run lint     # ESLint
```

## Adding a new state-aware tool

1. Create `src/tools/<tool>/` with `data.ts` (state rules + citations),
   `logic.ts` + `logic.test.ts` (pure functions), and `content.ts`.
2. Add an interactive client component in `src/components/tools/`.
3. Add `src/app/tools/<slug>/page.tsx` (landing) and `[state]/page.tsx`
   (`generateStaticParams` + `dynamicParams = false`).
4. Register it in `src/lib/tools.ts` and add its state codes to `src/app/sitemap.ts`.

## Environment variables

See [`.env.example`](./.env.example) and [`DEPLOY.md`](./DEPLOY.md). Nothing is
required for the free tools to work locally; analytics, Stripe, and Supabase are
opt-in via env vars.
